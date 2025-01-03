export interface Station {
    name: string;
    lat: number;
    lng: number;
  }
  
  export interface Line {
    line: string;
    stations: Station[];
  }
  
  export interface MapData {
    type: string;
    features: Feature[];
  }
  
  export interface Feature {
    type: string;
    geometry: Geometry;
    properties: Properties;
  }
  
  export interface Geometry {
    type: string;
    coordinates: number[][];
  }
  
  export interface Properties {
    OBJECTID_1: number;
    OBJECTID: number;
    Rail_Name: string;
    Trans_Mode: string;
    Line_Statu: string;
    Tunnel: string;
    Direction: string;
    Miles: number;
  }