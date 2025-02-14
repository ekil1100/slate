import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";

import ScenePage from "~/components/core/ScenePage";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import DataView from "~/components/core/DataView";
import EmptyState from "~/components/core/EmptyState";

const STYLES_SCENE_PAGE = css`
  padding: 0px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0px;
  }
`;

const STYLES_DATAVIEWER_WRAPPER = (theme) => css`
  width: 100%;
  min-height: calc(100vh - ${theme.sizes.filterNavbar}px);
  padding: calc(20px + ${theme.sizes.filterNavbar}px) 24px 44px;
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: calc(31px + ${theme.sizes.filterNavbar}px) 16px 44px;
  }
`;

export default function SceneFilesFolder({ viewer, page, onAction, isMobile }) {
  const [index, setIndex] = React.useState(-1);

  let objects = viewer.library;
  // const tab = page.params?.tab || "grid";

  return (
    <WebsitePrototypeWrapper
      title={`${page.pageTitle} • Slate`}
      url={`${Constants.hostname}${page.pathname}`}
    >
      <ScenePage css={STYLES_SCENE_PAGE}>
        <GlobalCarousel
          viewer={viewer}
          objects={objects}
          onAction={onAction}
          isMobile={isMobile}
          params={page.params}
          isOwner={true}
          index={index}
          onChange={(index) => setIndex(index)}
        />
        <div css={STYLES_DATAVIEWER_WRAPPER}>
          {objects.length ? (
            <DataView
              key="scene-files-folder"
              isOwner={true}
              items={objects}
              onAction={onAction}
              viewer={viewer}
              page={page}
              view="grid"
            />
          ) : (
            <EmptyState>
              <FileTypeGroup />
              <div style={{ marginTop: 24 }}>Drag and drop files into Slate to upload</div>
            </EmptyState>
          )}
        </div>
      </ScenePage>
    </WebsitePrototypeWrapper>
  );
}
