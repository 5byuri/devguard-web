import { useRouter } from "next/router";

import { config } from "@/config";
import { useActiveOrg } from "@/hooks/useActiveOrg";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";

import CopyCode from "../common/CopyCode";
import CustomTab from "../common/CustomTab";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Steps from "./Steps";

import { useActiveAsset } from "@/hooks/useActiveAsset";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useAutosetup } from "@/hooks/useAutosetup";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import { Loader2 } from "lucide-react";
import Section from "../common/Section";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Autosetup from "../Autosetup";
import GitlabTokenInstructions from "./GitlabTokenInstructions";
import GithubTokenInstructions from "./GithubTokenInstructions";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const SCADialog: FunctionComponent<Props> = ({ open, setOpen }) => {
  const router = useRouter();
  const activeOrg = useActiveOrg();

  const activeProject = useActiveProject();
  const asset = useActiveAsset();

  const { handleAutosetup, isLoading, Loader, progress, onCreatePat, pat } =
    useAutosetup("sca");

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const el = document.querySelector('[data-state="open"]');
        if (el) {
          el.scrollTo({ behavior: "instant", top: 0 });
        }
      });
    }
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent setOpen={setOpen}>
        <DialogHeader>
          <DialogTitle>Software Composition Analysis</DialogTitle>
          <DialogDescription>
            Software Composition Analysis (SCA) is a security testing method
            that identifies known vulnerabilities in third-party and open source
            libraries. DevGuard provides a CLI tool to scan your project for
            known vulnerabilities in your dependencies.
          </DialogDescription>
        </DialogHeader>
        <hr />
        <div>
          <Section
            className="mb-0 mt-0 pb-0 pt-0"
            description="To use the Devguard-Scanner, you need to create a Personal Access
              Token. You can create such a token by clicking the button below."
            title="Create a Personal Access Token"
            forceVertical
          >
            {pat && (
              <div className="flex flex-row items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-row gap-2">
                    <CopyCode language="shell" codeString={pat.privKey} />
                  </div>

                  <span className=" block text-right text-sm text-destructive">
                    Make sure to copy the token. You won&apos;t be able to see
                    it ever again!
                  </span>
                </div>
              </div>
            )}
            {!pat && (
              <div>
                <Button
                  variant={"default"}
                  onClick={() => onCreatePat({ description: "SCA Analysis" })}
                >
                  Create Personal Access Token
                </Button>
              </div>
            )}
          </Section>
        </div>
        <hr />
        <Tab.Group>
          <Tab.List>
            <CustomTab>
              <Image
                src="/assets/github.svg"
                width={20}
                className="mr-2 inline dark:invert"
                height={20}
                alt="GitHub"
              />
              Using GitHub Actions
            </CustomTab>
            <CustomTab>
              <Image
                src="/assets/gitlab.svg"
                width={20}
                className="mr-2 inline"
                height={20}
                alt="GitLab"
              />
              Using GitLab CI/CD
            </CustomTab>
            <CustomTab>
              <Image
                src="/assets/docker.svg"
                width={20}
                className="mr-2 inline"
                height={20}
                alt="Docker Logo"
              />
              Using Docker
            </CustomTab>
          </Tab.List>
          <Tab.Panels className={"mt-2"}>
            <Tab.Panel>
              <Steps>
                <GithubTokenInstructions pat={pat?.privKey} />
                <div className="mb-10">
                  <h3 className="mb-4 mt-2 font-semibold">
                    Create or insert the yaml snippet inside a .github/workflows
                    file
                  </h3>
                  <CopyCode
                    language="yaml"
                    codeString={`# DevSecOps Workflow Definition
# This workflow is triggered on every push to the repository
name: DevSecOps Workflow
on:
    push:

jobs:
  # ----- BEGIN Software Composition Analysis Job -----
  # Software Composition Analysis (SCA) to find vulnerabilities in project dependencies
  call-software-compsition-analysis:
    uses: ./.github/workflows/software-composition-analysis.yml
    with:
      asset-name: "${activeOrg.slug}/projects/${activeProject?.slug}/assets/${asset?.slug}"
      api-url: "https://api.main.devguard.org/"
      sca-path: "/github/workspace"
    secrets:
      devguard-token: "\${{ secrets.DEVGUARD_TOKEN }}"

  # ----- END Software Composition Analysis Job -----`}
                  ></CopyCode>
                </div>
                <div>
                  <h3 className="mb-4 mt-2 font-semibold">
                    Commit and push the changes to the repository.
                    <br /> You can also trigger the workflow manually
                  </h3>
                </div>
              </Steps>
            </Tab.Panel>
            <Tab.Panel>
              <Autosetup
                isLoading={isLoading}
                handleAutosetup={handleAutosetup}
                progress={progress}
                Loader={Loader}
              />
              <div className="my-8 flex flex-row items-center text-center text-muted-foreground">
                <div className="flex-1 border-t-2 border-dotted" />
                <span className="px-5">OR</span>
                <div className="flex-1 border-t-2 border-dotted" />
              </div>
              <Steps>
                <GitlabTokenInstructions pat={pat?.privKey} />
                <div className="mb-10">
                  <h3 className="mb-4 mt-2 font-semibold">
                    Create or insert the yaml snippet inside a .gitlab-ci.yml
                    file
                  </h3>
                  <CopyCode
                    language="yaml"
                    codeString={`# DevGuard CI/CD Component (https://gitlab.com/l3montree/devguard)
include:
- component: gitlab.com/l3montree/devguard/sca@~latest
  inputs:
    asset_name: ${activeOrg?.slug}/projects/${router.query.projectSlug}/assets/${router.query.assetSlug}
    token: "$DEVGUARD_TOKEN"
`}
                  ></CopyCode>
                </div>
                <div>
                  <h3 className="mb-4 mt-2 font-semibold">
                    Commit and push the changes to the repository.
                  </h3>
                </div>
              </Steps>
            </Tab.Panel>
            <Tab.Panel>
              <CopyCode
                language="shell"
                codeString={`docker run -v "$(PWD):/app" ghcr.io/l3montree-dev/devguard-scanner:${config.devguardScannerTag} \\
    devguard-scanner sca \\
        --path="/app" \\
        --assetName="${activeOrg?.slug}/projects/${router.query.projectSlug}/assets/${router.query.assetSlug}" \\
        --apiUrl="${config.publicDevGuardApiUrl}" \\
        --token="${pat?.privKey ?? "<YOU NEED TO CREATE A PERSONAL ACCESS TOKEN>"}"`}
              ></CopyCode>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <DialogFooter>
          <Button autoFocus variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SCADialog;
