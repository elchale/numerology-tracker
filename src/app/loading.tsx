export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-muted-2">
      <div className="flex flex-col items-center gap-3 anim-fade-up">
        <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center anim-pulse-glow">
          <span className="display text-gold text-xl">N</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em]">Loading</p>
      </div>
    </div>
  );
}
