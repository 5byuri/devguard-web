// Copyright (C) 2023 Sebastian Kawelke, l3montree UG (haftungsbeschraenkt)
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

import { useOrg } from "@/hooks/useOrg";
import { classNames } from "@/utils/common";
import {
  BuildingOffice2Icon,
  CogIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "../../zustand/globalStoreProvider";
import { buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useActiveOrg } from "@/hooks/useActiveOrg";
import { OrganizationDetailsDTO } from "@/types/api/api";

interface Props {}

export default function UserNav() {
  const router = useRouter();

  const { setTheme } = useTheme();
  const updateOrganization = useStore((s) => s.updateOrganization);

  const user = useStore((s) => s.session?.identity);
  const orgs = useStore((s) => s.organizations);

  const activeOrg = useOrg() ?? orgs[0];

  const handleActiveOrgChange = (id: string) => () => {
    // redirect to the new slug
    const org = orgs.find((o) => o.id === id);
    if (org) {
      router.push(`/${org.slug}`);
      updateOrganization(org as OrganizationDetailsDTO);
    }
  };

  const handleNavigateToSetupOrg = () => {
    router.push(`/setup-organization`);
  };

  return (
    <div className="flex flex-row justify-between gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex w-10 flex-row justify-center">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-background transition-all dark:-rotate-90 dark:scale-0 dark:text-muted-foreground" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-background transition-all dark:rotate-0 dark:scale-100 dark:text-muted-foreground" />
            <span className="sr-only">Toggle theme</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {user && (
            <Link
              className={classNames(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "hover:bg-transparent hover:no-underline",
              )}
              href="/user-settings"
            >
              <Avatar>
                {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
                <AvatarFallback>
                  {(user.traits.name.first ?? "").charAt(0).toUpperCase() +
                    (user.traits.name.last ?? "").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link className="hover:no-underline" href={"/user-settings"}>
            <DropdownMenuItem className="text-foreground hover:no-underline">
              <CogIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              User Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleNavigateToSetupOrg}>
            <BuildingOffice2Icon className="mr-2 h-5 w-5 text-muted-foreground" />
            Join Organization
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleNavigateToSetupOrg}>
            <PlusIcon className="mr-2 h-5 w-5 text-muted-foreground" />
            Create Organization
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {orgs.length !== 0 && (
            <>
              {orgs.map((o) => (
                <DropdownMenuItem
                  key={o.id}
                  onClick={handleActiveOrgChange(o.id)}
                >
                  {o.name}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
