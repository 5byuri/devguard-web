// Copyright (C) 2023 Tim Bastin, l3montree UG (haftungsbeschränkt)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { FunctionComponent } from "react";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}
const Section: FunctionComponent<Props> = (props) => {
  return (
    <div className="border-b border-white/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-white">
        {props.title}
      </h2>
      {props.description !== undefined && (
        <p className="mt-1 text-sm leading-6 text-gray-400">
          {props.description}
        </p>
      )}
      <div className="mt-6">{props.children}</div>
    </div>
  );
};

export default Section;
