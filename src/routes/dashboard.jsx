// import UserProfile from "views/UserProfile/UserProfile";
import Signal from "Signal";
const dashboardRoutes = [
  {
    path: "/signal",
    name: "MarketSignal",
    icon: "pe-7s-play",
    component: Signal
},

  { redirect: true, path: "/", to: "/signal", name: "MarketSignal" }
];

export default dashboardRoutes;
