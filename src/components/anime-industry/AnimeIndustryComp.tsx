import { json, scaleLinear, select } from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  cleanUpData,
  filterDataByStudio,
  formatData,
  renderAreaChart,
  type AnimeData,
  type ChartData,
  type RawAnimeData,
  type StudioData,
} from "./utils";

import { GUI } from "lil-gui";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { setup3dScene, setupLighting } from "./3d-utils";
import Drawer from "./Drawer";
import GenereSelector from "./GenreSelector";
import StudioSelector from "./StudioSelector";
import { unique } from "radash";

// https://stackoverflow.com/questions/34370622/javascript-how-do-i-display-a-text-character-by-character

type Props = {
  test: string;
};

const AnimeIndustryComp = ({ test }: Props) => {
  // const [chartData, setChartData] = useState<ChartData[]>([]);
  console.log(test);
  const scene = new THREE.Scene();

  const [selected, setSelected] = useState<{
    genre: string[] | null;
    studio: StudioData | null;
  }>({
    genre: null,
    studio: null,
  });

  const [summary, setSummary] = useState<{
    cleanData: AnimeData[];
    filterData: AnimeData[];
    chartData: ChartData[];
    yearSeasonList: string[];
    genreList: string[];
    studioList: StudioData[];
  }>({
    cleanData: [],
    filterData: [],
    chartData: [],
    genreList: [],
    studioList: [],
    yearSeasonList: [],
  });

  const [dialog, setDialog] = useState<{
    openGenreFilter: boolean;
    openStudioFilter: boolean;
  }>({
    openGenreFilter: false,
    openStudioFilter: false,
  });

  const [threeEnvironment, setThreeEnvironment] = useState<{
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    controls: OrbitControls;
    gui: GUI;
  } | null>(null);

  // const [objectNameList, setObjectNameList] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const loadData = async () => {
      await json<RawAnimeData[]>("/anime-industry/data.json").then((res) => {
        if (res) {
          const { cleanData, studioList, yearSeasonList } = cleanUpData(res);
          setSummary((prev) => ({
            ...prev,
            cleanData,
            studioList,
            yearSeasonList,
          }));
          setSelected((prev) => ({ ...prev, studio: studioList[0] }));
        }
      });
    };

    loadData();
  }, []);

  // useEffect(()=>{

  // },[summary.cleanData,selected.studio])

  useMemo(() => {
    if (summary.cleanData.length > 0 && selected.studio) {
      const data = filterDataByStudio(summary.cleanData, selected.studio.name);

      const { genreList, yearSeasonList, groupDataByGenre } = formatData(data);
      setSummary((prev) => ({
        ...prev,
        filterData: data,
        genreList,
        yearSeasonList,
        chartData: groupDataByGenre,
      }));
      // cleanup

      select(".container").selectAll("svg").remove();
      groupDataByGenre.map((d) => renderAreaChart(d));
    }
  }, [summary.cleanData, selected.studio]);

  useEffect(() => {
    if (canvasRef.current && threeEnvironment && summary.chartData.length > 0) {
      const allData = summary.chartData;
      const { renderer, camera, controls, gui } = threeEnvironment;
      const chartGroup = new THREE.Group();

      const svgList = document.querySelectorAll("svg");
      const loader = new SVGLoader();
      const fontLoader = new FontLoader();
      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
      });

      const meshNameList: string[] = [];
      for (let i = 0; i < svgList.length; i++) {
        const svgData = loader.parse(svgList[i].outerHTML);
        const shape = svgData.paths[0].toShapes(true)[0];

        const geometry2 = new THREE.ExtrudeGeometry(shape, {
          steps: 0,
          depth: 16,
        });

        const cubeMaterial = new THREE.MeshStandardMaterial({
          color: 0x049ef4,
        });

        const mesh = new THREE.Mesh(geometry2, cubeMaterial);
        const name = svgList[i].classList.toString() || "";
        mesh.name = name;
        meshNameList.push(name);

        chartGroup.add(mesh);
        mesh.scale.set(0.01, 0.01, 0.01);
        mesh.rotation.set(0, Math.PI, Math.PI);
        mesh.position.set(0, 15, -10 + i / 3);

        mesh.castShadow = true; //default is false
        mesh.receiveShadow = true;

        fontLoader.load("anime-industry/Kanit.json", (font) => {
          const textGeometry = new TextGeometry(
            allData[i].genre.toUpperCase(),
            {
              font: font,
              size: 0.15,
              height: 0.04,
            },
          );

          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.geometry.computeBoundingBox();
          textMesh.geometry.translate(
            -textMesh.geometry.boundingBox!.max.x,
            0,
            0,
          );
          textMesh.rotation.set(-Math.PI / 2, 0, 0);
          textMesh.position.set(-0.2, 0.1, -10 + i / 3);

          chartGroup.add(textMesh);
        });

        scene.add(chartGroup);

        // setObjectNameList(meshNameList);
      }
      const meshBb = new THREE.Box3();
      meshBb.setFromObject(chartGroup);

      const xScale = scaleLinear()
        .domain([0, summary.yearSeasonList.length])
        .range([0, meshBb.max.x]);

      for (let i = 0; i < summary.yearSeasonList.length; i++) {
        fontLoader.load("anime-industry/Kanit.json", (font) => {
          const xTick = summary.yearSeasonList[i];

          const textGeometry = new TextGeometry(xTick.toString(), {
            font: font,
            size: 0.05,
            height: 0.01,
            curveSegments: 1,
          });

          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.rotation.set(-Math.PI / 2, 0, -Math.PI / 3);

          textMesh.position.set(xScale(i) - 0.04, 0, meshBb.max.z + 0.1);
          scene.add(textMesh);
        });
      }

      setupLighting(scene, renderer, gui);

      const animate = () => {
        requestAnimationFrame(animate);
        // const offset = new THREE.Vector3();
        // const distance = 1;

        // offset.x = distance * Math.sin(time * 0.001);
        // offset.y = 2;
        // offset.z = distance * Math.cos(time * 0.001);

        // camera.position.copy(chartGroup.position).add(offset);

        controls.update();
        renderer.render(scene, camera);
      };

      animate();
      return () => {
        if (threeEnvironment.gui) gui.destroy();
      };
    }
  }, [canvasRef.current, threeEnvironment, summary.chartData]);

  useEffect(() => {
    // first setup
    if (canvasRef.current && !threeEnvironment) {
      const { renderer, camera, controls, gui } = setup3dScene(
        scene,
        canvasRef.current,
      );
      setThreeEnvironment({ renderer, camera, controls, gui });
    }
  }, [canvasRef.current, threeEnvironment]);

  return (
    <div className="bg-black font-kanit">
      <div className="relative size-full w-screen h-screen text-white">
        <div className="absolute inset-0">
          <div className="flex flex-row justify-center flex-wrap">
            {unique(summary.filterData.slice(-200), (d) => d.title).map(
              (d, i) => (
                <div key={`${d.title}-${i}`} className="">
                  <img src={d.img} className="w-[175px] h-[250px]" />
                </div>
              ),
            )}
          </div>
        </div>
        <canvas className="absolute inset-0" ref={canvasRef} />
        <div className="absolute right-0 min-w-[300px]">
          <div className="pt-8  space-y-2 flex flex-col">
            <button
              className="ml-auto bg-black text-white px-4 py-1 hover:px-8 transition-all min-w-20"
              onClick={() =>
                setDialog((prev) => ({ ...prev, openStudioFilter: true }))
              }
            >
              Studio
            </button>
            <button
              className="ml-auto bg-black text-white px-4 py-1 hover:px-8 transition-all min-w-20"
              onClick={() =>
                setDialog((prev) => ({ ...prev, openGenreFilter: true }))
              }
            >
              Genre
            </button>
          </div>
        </div>
        <div className="absolute">
          <div className="max-w-sm p-4">
            {selected.studio && (
              <>
                <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
                  <div className="font-bold">Studio: </div>
                  <div>{selected.studio?.name}</div>
                </div>
                <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
                  <div className="font-bold">Total: </div>
                  <div>{selected.studio?.count}</div>
                </div>
              </>
            )}
            <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
              <div className="font-bold">Genre: </div>
              {!selected.genre ? (
                <div>All Genre</div>
              ) : (
                <>
                  {selected.genre.map((d) => (
                    <div key={`selected-genre-${d}`}>{d}</div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="p-4">
            <button
              onClick={() => {
                if (threeEnvironment) {
                  threeEnvironment.controls.autoRotate =
                    !threeEnvironment.controls.autoRotate;
                }
              }}
            >
              {threeEnvironment &&
              threeEnvironment.controls.autoRotate === false
                ? "Start"
                : "Stop"}{" "}
              Rotation
            </button>
          </div>
        </div>
        <Drawer
          title={"Studio Filter"}
          open={dialog.openStudioFilter}
          onClose={() =>
            setDialog((prev) => ({ ...prev, openStudioFilter: false }))
          }
        >
          <StudioSelector
            selected={selected.studio}
            studioList={summary.studioList}
            onChange={(v) =>
              setSelected((prev) => ({ ...prev, studio: v, genre: null }))
            }
          />
        </Drawer>
        <Drawer
          title={"Genre Filter"}
          open={dialog.openGenreFilter}
          onClose={() =>
            setDialog((prev) => ({ ...prev, openGenreFilter: false }))
          }
        >
          <GenereSelector
            genreList={summary.genreList}
            selectedGenreList={selected.genre || []}
            onChange={(v) =>
              setSelected((prev) => ({
                ...prev,
                genre: v.length === 0 ? null : v,
              }))
            }
          />
        </Drawer>
      </div>
      <div className="container hidden"></div>
    </div>
  );
};

export default AnimeIndustryComp;
