// eslint-disable-next-line no-restricted-imports -- the one place next/image is wrapped
import NextImage, { type ImageProps } from "next/image";

import { imageSrc } from "@/lib/base-path";

/**
 * Drop-in for next/image that applies the /holidays basePath to a string
 * `src` (see imageSrc in lib/base-path.ts). Import this everywhere instead
 * of next/image; ESLint blocks the direct import so a new call site cannot
 * quietly ship broken images.
 */
export default function Image(props: ImageProps) {
  return <NextImage {...props} src={imageSrc(props.src)} />;
}
