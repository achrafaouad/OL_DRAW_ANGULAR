import { Component, OnInit } from '@angular/core';
import Draw from 'ol/interaction/Draw';
import LayerTile from 'ol/layer/Tile';

import Map from "ol/Map";
import XYZ from 'ol/source/XYZ';
import FullScreen from 'ol/control/FullScreen';
import Zoom from 'ol/control/Zoom';
import ScaleLine from 'ol/control/ScaleLine';
import { Feature, Overlay, View } from 'ol';

import VectorSource from 'ol/source/Vector';
import GeoJSON from "ol/format/GeoJSON";
// import { geo } from 'src/assets/communes';
import VectorLayer from 'ol/layer/Vector';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  map:any
  source = new VectorSource({wrapX: false});
    vector = new VectorLayer({
    source: this.source,
    });
  value: any;
  draw: Draw;
  lastFeature: any;
  format =new GeoJSON();
  last_feature: any;
  ngOnInit(): void {

    this.map= new Map({
      layers: [
      new LayerTile({

      visible: true,
      source: new XYZ({
      url:
      'https://a.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}@2x.png'})
      } ),
      this.vector],
      target: "mapPrev",
      
      view: new View({
      center: [
      -6, 35
      ],
      zoom: 5,
      projection: "EPSG:4326",
      }),
      controls:[new Zoom(), new FullScreen(),new ScaleLine()]
      });
  }
  title = 'outilDelimitation';

  addInteraction() {
    // this.value ='Point';
    if (this.value !== 'None') {
    this.draw = new Draw({
    source: this.source,
    type: this.value,
    });
    this.draw.on('drawend', (event:any) => {
    console.log('drawend');
    this.lastFeature = event.feature;
    });
    this.map.addInteraction(this.draw);
    this.source.on("addfeature", (evt) => {
    var feature:any = evt.feature;
    var coords = feature.getGeometry();
    var Features:any = this.format.writeGeometry(coords);
    Features = JSON.parse(Features);
    
    Features["crs"] = { type: "name", properties: { } };
    Features = JSON.stringify(Features);
    this.last_feature = Features;
    console.log("hana", this.last_feature);
    console.log(feature.getGeometry().getExtent())
    
    });
    }
    }


    changto(val:any){
      console.log(val);
      this.value = val
      this.map.removeInteraction(this.draw);
      this.addInteraction();
      }


}
