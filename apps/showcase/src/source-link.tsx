import { sources, type SourceId } from "./philosophy-data";

export function SourceLink({ id }: { id: SourceId }) {
  return <a className="source-link" href={sources[id].href} target="_blank" rel="noreferrer">{sources[id].label}<span aria-hidden="true"> ↗</span></a>;
}
