import React from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

const data = [
  { name: 'ToDo', value: 400 },
  { name: 'Solved', value: 300 },
  { name: 'Attempted', value: 300 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  progress: {
    margin: 8,
  },
  caption: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  captionItem: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  settings: {
    height: 25,
    width: 25,
    marginTop: 8,
    marginLeft: 'auto',
    marginRight: 10,
    float: 'right',
  },
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function YourProgress() {
  const classes = useStyles();

  const jsfiddleUrl = 'https://jsfiddle.net/alidingling/hqnrgxpj/';
  const [activeIndex, setActiveIndex] = React.useState(0);

  // state = {
  //   activeIndex: 0,
  // };
  //
  // nPieEnter = (data, index) => {
  //   this.setActiveIndex(index);
  // };

  return (
    <Paper>
      <div className={classes.root}>
        <Avatar alt="Your Progress" src={'/increase_100px.png'} />
        <Typography className={classes.progress} variant="h5" gutterBottom>
          Your Progress
        </Typography>
        <Avatar
          alt="Settings"
          className={classes.settings}
          src={'/settings_24px.png'}
        />
      </div>

      <hr />
      <div className={classes.root}>
        <Typography variant="h6" gutterBottom>
          Coin: 300
        </Typography>
        <Avatar alt="Coins" src={'/coins_48px.png'} />
      </div>

      <PieChart width={400} height={250}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseOver={(data, index) => {
            setActiveIndex(index);
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      <hr />

      <div className={classes.caption}>
        <div className={classes.captionItem} style={{ color: COLORS[0] }}>
          <div>200</div>
          <span>Todo</span>
        </div>
        <div className={classes.captionItem} style={{ color: COLORS[1] }}>
          <div>2/198</div>
          <span>Solved</span>
        </div>
        <div className={classes.captionItem} style={{ color: COLORS[2] }}>
          <div>0</div>
          <span>Attempted</span>
        </div>
      </div>
    </Paper>
  );
}
