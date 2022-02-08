/** @format */

import React, { useCallback, useMemo, useState } from "react";
import { Button } from "zent";

import "./style.less";

const AreaX = 10;
const AreaY = 10;

interface IBoxItemProps {
  x: number;
  y: number;
  isSelected: boolean;
}
//  最后整理后的地图数据
interface IBoxResult {
  x: number; // x轴的长度
  y: number; // y轴的长度
  islands: Array<[number, number]>; // 选中的box们的坐标
}

const MapMaker: React.FC = () => {
  const [selectedBoxs, setSelectedBoxs] = useState<Array<[number, number]>>([]);

  //清空
  const handleClear = useCallback(() => {
    setSelectedBoxs([]);
  }, []);

  //输出结果
  const handleExport = useCallback(() => {
    const content = JSON.stringify(selectedBoxs);
    // 创建隐藏的可下载链接
    const eleLink = document.createElement("a");
    const currentTime = new Date();
    eleLink.download = `地图数据${currentTime.toLocaleString()}.json`;
    eleLink.style.display = "none";
    // 字符内容转变成blob地址
    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }, [selectedBoxs]);

  const findSelectedIndex = useCallback(
    (i, j) => {
      return selectedBoxs.findIndex(
        (selectedBox: [number, number]) =>
          selectedBox[0] === i && selectedBox[1] === j,
      );
    },
    [selectedBoxs],
  );

  const boxs = useMemo(() => {
    const result = [];
    for (let i = 0; i < AreaX; i++) {
      for (let j = 0; j < AreaY; j++) {
        const target: IBoxItemProps = {
          x: i,
          y: j,
          isSelected: findSelectedIndex(i, j) !== -1,
        };
        if (j === 0) {
          result[i] = [target];
        } else {
          result[i].push(target);
        }
      }
    }
    return result;
  }, [findSelectedIndex]);

  const changeBoxSelect = useCallback(
    (boxItem: IBoxItemProps) => () => {
      const { x, y, isSelected } = boxItem;
      if (isSelected) {
        const currentIndex = findSelectedIndex(x, y);
        selectedBoxs.splice(currentIndex, 1);
        setSelectedBoxs([...selectedBoxs]);
      } else {
        selectedBoxs.push([x, y]);
      }
      setSelectedBoxs([...selectedBoxs]);
    },
    [findSelectedIndex, selectedBoxs],
  );

  return (
    
    <div className="map-maker-container">
      <div>
        <Button onClick={handleClear}>清空</Button>
        <Button onClick={handleExport}>生成数据</Button>
      </div>
      <div>
        <div className="continer">
          <div className="total"> 当前一共有{selectedBoxs.length}个格子 </div>
          <div className="operate_area">
            {boxs.map((boxRow, index) => {
              return (
                <div key={index}>
                  {boxRow.map((boxItem) => {
                    const { x, y, isSelected } = boxItem;
                    const selectedIndex = findSelectedIndex(x, y);
                    return (
                      <div
                        key={x + "_" + y}
                        onClick={changeBoxSelect(boxItem)}
                        className={"box_item" + (isSelected ? " active" : "")}
                      >
                        {isSelected ? selectedIndex + 1 : null}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapMaker;
