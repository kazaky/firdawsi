import { sources, type Language, type SourceId } from "./philosophy-data";

export function SourceLink({ id, language = "en" }: { id: SourceId; language?: Language }) {
  return <a className="source-link" href={sources[id].href} target="_blank" rel="noreferrer">{sources[id].label[language]}<span aria-hidden="true"> ↗</span></a>;
}
