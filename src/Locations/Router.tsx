import { FC } from "react";
import { Cities } from "./Cities/Cities";
import { City } from "./Cities/City";
import { States } from "./States";

import { Routes, Route } from "react-router-dom";

export const LocationRouter: FC = () => {
  return (
    <Routes>
      <Route index element={<States />} />
      <Route path="states/:name/:id" element={<Cities />} />
      <Route path="city/:name/:id" element={<City />} />
      <Route path="add/:state" element={<City />} />
    </Routes>
  );
};
