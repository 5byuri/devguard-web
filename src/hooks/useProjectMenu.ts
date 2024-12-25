// Copyright (C) 2024 Tim Bastin, l3montree UG (haftungsbeschränkt)
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
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
  ChartBarSquareIcon,
  CogIcon,
  ListBulletIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useCurrentUser } from "./useCurrentUser";

export const useProjectMenu = () => {
  const router = useRouter();
  const orgSlug = router.query.organizationSlug as string;
  const projectSlug = router.query.projectSlug as string;

  const loggedIn = useCurrentUser();

  const menu = [
    {
      title: "Overview",
      href: "/" + orgSlug + "/projects/" + projectSlug,
      Icon: ChartBarSquareIcon,
    },
    {
      title: "Compliance",
      href: "/" + orgSlug + "/projects/" + projectSlug + "/compliance",
      Icon: ScaleIcon,
    },

    {
      title: "Subprojects & Assets",
      href: "/" + orgSlug + "/projects/" + projectSlug + "/assets",
      Icon: ListBulletIcon,
    },
  ];
  if (loggedIn) {
    return menu.concat([
      {
        title: "Settings",
        href: "/" + orgSlug + "/projects/" + projectSlug + "/settings",
        Icon: CogIcon,
      },
    ]);
  }
  return menu;
};
