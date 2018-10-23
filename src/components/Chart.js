import React from 'react';
import {Sparklines, SparklinesBars, SparklinesReferenceLine} from 'react-sparklines';
import _ from 'lodash';

const average = (data) => {
  return _.round(_.sum(data)/data.length);
}

const Chart = (props) => {
  return(
    <div>
      <Sparklines height={120} width={200} data={props.data}>
        <SparklinesBars style={{fill: `${props.color}`}} />
        <SparklinesReferenceLine  type ="avg" />
      </Sparklines>
      <div>{average(props.data)} {props.units}</div>
    </div>
  );
}

export default Chart;
