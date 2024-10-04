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

import { OrganizationDetailsDTO } from "@/types/api/api";
import { GetServerSidePropsContext } from "next";
import { getApiClientFromContext } from "../services/devGuardApi";
import { HttpError } from "./middleware";

export async function withOrganization(ctx: GetServerSidePropsContext) {
  // get the devGuardApiClient
  const devGuardApiClient = getApiClientFromContext(ctx);
  // check if there is a slug in the query
  const organizationSlug = ctx.params?.organizationSlug;

  if (organizationSlug) {
    // get the organization
    const r = await devGuardApiClient("/organizations/" + organizationSlug);
    // parse the organization
    const organization: OrganizationDetailsDTO = await r.json();

    if (!r.ok) {
      console.log("LOGIN REDIRECT", r);
      // it must be an 500
      throw new HttpError({
        redirect: {
          destination: "/login",
          permanent: false,
        },
      });
    }

    return organization;
  } else {
    return null;
  }
}
