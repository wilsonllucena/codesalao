type ContentProps = {
  children: React.ReactNode;
};
export function Content({ children }: ContentProps) {
  return (
    <main>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-8">
        {children}
      </div>
    </main>
  );
}
