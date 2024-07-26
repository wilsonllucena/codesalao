type HeadingProps = {
  title: string;
};
export function Heading({ title }: HeadingProps) {
  return (
    <div className="flex items-center">
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
    </div>
  );
}
