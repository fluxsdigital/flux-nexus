type StitchScreenProps = {
  title: string;
  source: string;
};

/**
 * Isolates each original Stitch document so its Tailwind runtime, fonts and
 * global CSS remain pixel-faithful and cannot leak into the Next.js shell.
 */
export function StitchScreen({ title, source }: StitchScreenProps) {
  return (
    <iframe
      src={source}
      title={title}
      style={{ width: "100%", height: "100dvh", border: 0, display: "block" }}
    />
  );
}
