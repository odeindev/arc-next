import { FeaturesSection } from "@/components/widgets/features/features-section";
import { HeroSection } from "@/components/widgets/hero/ui/hero-section";

import React from "react";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
