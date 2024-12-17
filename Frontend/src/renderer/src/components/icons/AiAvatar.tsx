export default function AiAvatar({ height, width }: { height: number; width: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="circleLetterATitle circleLetterADesc"
      role="img"
    >
      <title id="circleLetterATitle">Circle with letter A</title>
      <desc id="circleLetterADesc">
        A circular shape containing the uppercase letter A in the center
      </desc>
      <circle cx="50" cy="50" r="45" fill="#212121" stroke="white" strokeWidth="1" />
      <text
        x="50"
        y="50"
        fontFamily="Arial, sans-serif"
        fontSize="45"
        fontWeight="bold"
        fill="#FFFF"
        textAnchor="middle"
        dominantBaseline="middle"
        dy=".1em"
      >
        A
      </text>
    </svg>
  )
}
