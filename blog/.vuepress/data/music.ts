const basePath = "/music/";

interface GetMusicOptions {
  name: string;
  artist: string;
  urlType: string;
  coverType: string;
}

interface MusicInfo {
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc: string;
}

const getMusicInfo = (opt: GetMusicOptions): MusicInfo => {
  const musicPath = `${basePath}${opt.artist}/${opt.name}`;

  return {
    name: opt.name,
    artist: opt.artist,
    url: `${musicPath}/audio.${opt.urlType}`,
    cover: `${musicPath}/cover.${opt.coverType}`,
    lrc: `${musicPath}/lyrics.lrc`,
  };
};

// 全局音乐列表
export const globalMusicList: MusicInfo[] = [
  getMusicInfo({
    name: "水星记",
    artist: "郭顶",
    urlType: "m4a",
    coverType: "webp",
  }),
  getMusicInfo({
    name: "若把你",
    artist: "Kirsty刘瑾睿",
    urlType: "m4a",
    coverType: "jpg",
  }),
  getMusicInfo({
    name: "想去海边",
    artist: "夏日入侵企画",
    urlType: "m4a",
    coverType: "jpg",
  }),
];
