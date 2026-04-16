import { FallingPattern } from "./ui/falling-pattern";

export default function FallingPatternDemo() {
	return (
		<div className="w-full relative min-h-[400px] glass rounded-lg overflow-hidden my-12">
			<FallingPattern 
        color="var(--color-red-forensic)"
        backgroundColor="transparent"
        className="h-full [mask-image:radial-gradient(ellipse_at_center,transparent,rgba(0,0,0,1))]" 
      />
			<div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
				<h1 className="font-pixel text-2xl font-extrabold tracking-tighter text-red-forensic">
					FORENSIC SCAN
				</h1>
			</div>
		</div>
	);
}
