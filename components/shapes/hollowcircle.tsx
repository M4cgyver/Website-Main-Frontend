import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  width: number;
  height: number;
  strokeWidth: number;
  color: string;
}

const HollowCircle: React.FC<Props> = ({ width, height, color, strokeWidth, ...props }) => (
  <svg width={width} height={height} {...props}>
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width / 2 - 1}
      ry={height / 2 - 1}
      stroke={color}
      fill="none"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export default HollowCircle;
