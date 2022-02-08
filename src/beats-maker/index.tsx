/** @format */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Upload, Icon } from "zent";

import "./style.less";

interface IBeats {
  a: number[]; //砰
  b: number[]; // 啪
  mixin: number[]; // 砰啪时间顺序混合
}
//  最后整理后的节拍数据
interface IBoxResult {
  x: number; // x轴的长度
  y: number; // y轴的长度
  islands: Array<[number, number]>; // 选中的box们的坐标
}

const BeatsMaker: React.FC = () => {
  const [beats, setBeats] = useState<
    { type: "ArrowLeft" | "ArrowRight"; time: number }[]
  >([]);
  const [song, setSong] = useState<File>();
  const [isRecording, setIsRecording] = useState(false);
  const songRef = useRef<HTMLAudioElement>(null);

  //清空节拍，停止
  const handleClear = useCallback(() => {
    setBeats([]);
    if (songRef.current) {
      songRef.current.pause();
      songRef.current.currentTime = 0;
    }
  }, []);

  //开始
  const start = useCallback(() => {
    console.log("start", song, songRef);
    setIsRecording(true);
    songRef.current?.play();
  }, [song]);

  // 播放结束
  const onEnd = useCallback(() => {
    console.log("end", song, songRef);
    setIsRecording(false);
  }, [song]);

  // 音乐上传成功
  const onUploadChange = useCallback((uploadFileList) => {
    setSong(uploadFileList[0]?.file);

    return false;
  }, []);

  // 记录节奏
  const listener = useCallback(
    (e: KeyboardEvent) => {
      if (
        !song ||
        !isRecording ||
        !["ArrowLeft", "ArrowRight"].includes(e.code)
      ) {
        return;
      }
      const beat = {
        type: e.code as "ArrowLeft" | "ArrowRight",
        time: songRef.current?.currentTime as number,
      };
      setBeats([...beats, beat]);
    },
    [beats, isRecording, song],
  );

  // 注册按键监听
  useEffect(() => {
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [listener]);

  // 音乐的播放url
  const url = useMemo(() => {
    if (!song) {
      return "";
    }
    return URL.createObjectURL(song);
  }, [song]);

  //导出结果
  const handleExport = useCallback(() => {
    const content = JSON.stringify(beats);
    // 创建隐藏的可下载链接
    const eleLink = document.createElement("a");
    const currentTime = new Date();
    eleLink.download = `节拍数据${currentTime.toLocaleString()}.json`;
    eleLink.style.display = "none";
    // 字符内容转变成blob地址
    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }, [beats]);

  // 记录的节拍
  const beatsDomList = useMemo(() => {
    return beats.map((beat, index) => {
      const isUp = beat.type === "ArrowLeft";
      const type = isUp ? "up-circle-o" : "down-circle";
      let classname = isUp ? "upIcon" : "downIcon";
      if (index === beats.length - 1) {
        classname += " firstIcon";
      }
      return <Icon type={type} className={classname} key={index} />;
    });
  }, [beats]);

  return (
    <div className="beatsMakerContainer">
      <div className="operatorArea">
        <div className="row">
          <Button onClick={start} type="primary" disabled={!song} size="large">
            开始
          </Button>
        </div>
        <div className="row">
          <Button onClick={handleClear}>停止&清空</Button>
          <Button onClick={handleExport}>生成数据</Button>
        </div>
        <div className="row">
          <Upload
            maxSize={20 * 1024 * 1024}
            onChange={onUploadChange}
            maxAmount={1}
          />
        </div>
        {song ? (
          <div className="row">
            <p className="songName">{song.name}</p>
            <audio src={url} ref={songRef} controls onEnded={onEnd} />
          </div>
        ) : null}
      </div>
      <div>
        <div className="beatContainer">{beatsDomList}</div>
      </div>
    </div>
  );
};

export default BeatsMaker;
