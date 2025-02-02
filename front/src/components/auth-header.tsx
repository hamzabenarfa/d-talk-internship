export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
        <p className="text-pink-500">{subtitle}</p>
      </div>
    )
  }
  
  