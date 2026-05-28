interface DifficultyBadgeProps {
  difficulty: "Easy" | "Moderate" | "Challenging";
}

const badgeStyles = {
  Easy: "text-green-700",
  Moderate: "text-yellow-700",
  Challenging: "text-red-700",
};

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`text-sm font-medium ${badgeStyles[difficulty]}`}>
      [{difficulty}]
    </span>
  );
}
