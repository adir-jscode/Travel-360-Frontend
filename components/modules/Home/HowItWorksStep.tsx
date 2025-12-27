interface HowItWorksStepProps {
  icon: BoxIcon;
  title: string;
  description: string;
  stepNumber: number;
}
export function HowItWorksStep({
  icon: Icon,
  title,
  description,
  stepNumber,
}: HowItWorksStepProps) {
  return (
    <div className="group relative flex flex-col items-center text-center">
      {/* Connector Line (hidden on mobile/last item) */}
      <div className="absolute top-12 left-1/2 -z-10 hidden h-1 w-full -translate-y-1/2 bg-gray-200 lg:block last:hidden" />

      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-100 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:from-orange-200 group-hover:to-pink-200">
        <Icon className="h-10 w-10 text-orange-600 transition-colors group-hover:text-pink-600" />
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md">
          {stepNumber}
        </div>
      </div>

      <h3 className="mb-3 text-2xl font-extrabold text-gray-900">{title}</h3>
      <p className="max-w-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
