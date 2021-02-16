import { StagePage } from "@amfa-team/broadcast-service";
import { SpacePage } from "@amfa-team/space-service";
import { DotLoader } from "@amfa-team/theme-service";
import {
  defaultLoginDictionary,
  defaultLogoutDictionary,
  defaultRegisterDictionary,
  defaultRestrictedPageDictionary,
} from "@amfa-team/user-service";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../useApi";

function ViewFeature(): ReactElement {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { ws } = useApi();

  const render = useCallback(
    (space) => {
      if (space === null) {
        return <p>Not found</p>;
      }

      return <StagePage settings={{ endpoint: ws, spaceId }} />;
    },
    [ws, spaceId],
  );

  return (
    <div style={{ height: "calc(100% - 250px)" }}>
      <h3>View Feature</h3>
      <SpacePage
        slug={spaceId}
        loginDictionary={defaultLoginDictionary.fr}
        logoutDictionary={defaultLogoutDictionary.fr}
        registerDictionary={defaultRegisterDictionary.fr}
        dictionary={defaultRestrictedPageDictionary.fr}
        LoadingComponent={DotLoader}
      >
        {render}
      </SpacePage>
    </div>
  );
}

export default ViewFeature;
