import { StagePage } from "@amfa-team/broadcast-service";
import { defaultDictionary } from "@amfa-team/broadcast-service-types";
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

function BroadcastFeature(): ReactElement {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { ws } = useApi();

  const render = useCallback(
    (space) => {
      if (space === null) {
        return <p>Not found</p>;
      }

      return (
        <StagePage
          settings={{ endpoint: ws, spaceId }}
          dictionary={defaultDictionary.fr}
          onHangUp={() => {
            alert("todo");
          }}
          broadcastEnabled
        />
      );
    },
    [ws, spaceId],
  );

  return (
    <div style={{ height: "calc(100% - 110px)" }}>
      <h3>Broadcast Feature</h3>
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

export default BroadcastFeature;
