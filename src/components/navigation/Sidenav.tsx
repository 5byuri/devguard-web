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

import Image from "next/image";
import { classNames } from "../../utils/common";
import { useRouter } from "next/router";
import Link from "next/link";
import { useStore } from "../../zustand/globalStoreProvider";

interface Props {
  navigation: {
    name: string;
    href: string;
    icon: any;
  }[];
}

export default function Sidenav({ navigation }: Props) {
  const router = useRouter();
  const currentPath = router.pathname;

  const user = useStore((s) => s.session?.identity);
  const orgs = useStore((s) => s.organizations);

  const activeOrg = useStore((s) => s.activeOrganization);

  return (
    <div className="flex grow flex-row">
      <div className="bg-black/20 flex pt-4 pb-2 flex-col justify-between w-16 p-2">
        <div>
          <div className="bg-blue-100 relative z-30 rounded-sm font-semibold flex flex-col justify-center items-center text-black text-2xl aspect-square m-1">
            {activeOrg?.name[0]}
          </div>
          <div className="h-2 z-20 mx-1.5 rounded-full relative bottom-2 bg-blue-400"></div>
          <div className="h-2 mx-1.5 z-10 rounded-full relative bottom-3.5 bg-blue-900"></div>
        </div>
        <div className="flex flex-row justify-center">
          {user && (
            <Link href="/user-settings">
              <Image
                className="rounded-full bg-gray-800"
                src="/examples/tim.jpg"
                alt=""
                width={45}
                height={45}
              />
            </Link>
          )}
        </div>
      </div>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
        <div className="flex h-24 shrink-0 items-center">
          <Image
            className="mt-6 h-10 w-auto"
            src="logo_flaw_fix_white_l3.svg"
            alt="FlawFix by l3montree Logo"
            width={32}
            height={32}
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        item.href === currentPath
                          ? "bg-blue-900 text-white"
                          : "text-blue-100 hover:bg-blue-900 hover:text-white",
                        "group flex gap-x-3 rounded-sm p-2 text-sm font-semibold leading-6 hover:no-underline",
                      )}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}