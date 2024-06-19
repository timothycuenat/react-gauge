import React from 'react';
import {CSSProperties, SVGProps} from "react";

export interface GradientStop {
    offset: string;
    color: CSSProperties['color'];
    stopOpacity?: number;
}

type DialAlignment = 'top' | 'right' | 'bottom' | 'left';

export interface GaugeSettings {
    color?: {
        value?: CSSProperties['color'];
        unit?: CSSProperties['color'];
        minAndMax?: CSSProperties['color'];
        gaugeBase?: CSSProperties['color'];
        gaugePercent?: CSSProperties['color'];
    },
    text?: {
        value?: SVGProps<SVGTextElement>;
        unit?: SVGProps<SVGTextElement>;
        minAndMax?: SVGProps<SVGTextElement>;
    },
    container?: CSSProperties;
    gauge?: {
        gaugePercent?: SVGProps<SVGCircleElement>;
        gaugeBase?: SVGProps<SVGCircleElement>;
        dialAlignment?: DialAlignment;
        strokeWidth?: number;
        strokeOffset?: number;
        gaugeAngle?: number;
        transition?: CSSProperties['transition']
    };
}

export interface GaugeProps {
    value: number;
    unit?: string;
    title?: string;
    min: number;
    max: number;
    rounded?: boolean;
    format?: (value: number) => string;
    settings?: GaugeSettings;
    gaugeGradient?: GradientStop[];
    useGradient?: boolean;
    animated?: boolean;
    entryAnimation?: boolean;
}

const WIDTH = 100;
const HEIGHT = 100;

const calculatePercentage = (min: number, max: number, value: number): number => {
    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
};

const getDialAlignment = (align: DialAlignment): number => {
    const alignments = {top: 270, right: 0, bottom: 90, left: 180};
    return alignments[align];
};

export default function Gauge({
                                  value,
                                  title,
                                  unit = "",
                                  min,
                                  max,
                                  rounded = false,
                                  format,
                                  settings,
                                  gaugeGradient,
                                  useGradient = false,
                                  animated = false,
                              }: GaugeProps) {
    const percent = calculatePercentage(min, max, value);

    const {
        strokeWidth = 5,
        strokeOffset = 0.25,
        gaugeAngle = 270,
        dialAlignment = 'top',
    }: GaugeSettings['gauge'] = settings?.gauge || {};

    //Calculations for the gauge
    const RADIUS = (HEIGHT / 2) - (strokeWidth / 2) - strokeOffset;
    const CIRCUMFERENCE = RADIUS * 2 * Math.PI;
    const ARC_LENGTH = CIRCUMFERENCE * (gaugeAngle / 360);
    const ANGLE_TO_ROTATE = getDialAlignment(dialAlignment) - (gaugeAngle / 2); //Rotate the gauge to the correct position
    const PERCENT_NORMALIZED = Math.min(Math.max(percent, 0), 100);
    const OFFSET = ARC_LENGTH - (PERCENT_NORMALIZED / 100) * ARC_LENGTH; //Length of the stroke dash offset (value percentage of gauge)

    //Values for the svg
    const DASH_ARRAY = `${ARC_LENGTH} ${CIRCUMFERENCE}`;
    const TRANSFORM = `rotate(${ANGLE_TO_ROTATE}, ${WIDTH / 2}, ${HEIGHT / 2})`;
    const TRANSITION: CSSProperties['transition'] = animated
        ? settings?.gauge?.transition ?? "stroke-dashoffset 0.4s ease-out"
        : "none";

    return (
        <div className={"gauge"} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.75rem",
            color: "white",
            ...settings?.container
        }}>
            <svg height={`${HEIGHT}%`} width={`${WIDTH}%`} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
                <defs>
                    {useGradient && (
                        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            {gaugeGradient?.map((stop, index) => (
                                <stop
                                    key={index}
                                    offset={stop.offset}
                                    stopColor={stop.color}
                                    stopOpacity={stop.stopOpacity}
                                />
                            ))}
                        </linearGradient>
                    )}
                </defs>
                <circle
                    className="gauge_base"
                    cx={WIDTH / 2}
                    cy={HEIGHT / 2}
                    r={RADIUS}
                    fill="transparent"
                    stroke={settings?.color?.gaugeBase || "white"}
                    strokeLinecap={rounded ? 'round' : 'butt'}
                    strokeWidth={strokeWidth}
                    strokeDasharray={DASH_ARRAY}
                    transform={TRANSFORM}
                    {...settings?.gauge?.gaugeBase}
                />
                <circle
                    className="gauge_percent"
                    cx={WIDTH / 2}
                    cy={HEIGHT / 2}
                    fill="transparent"
                    r={RADIUS}
                    stroke={useGradient ? "url(#grad)" : settings?.color?.gaugePercent || "black"}
                    strokeDasharray={DASH_ARRAY}
                    strokeDashoffset={OFFSET}
                    strokeLinecap={rounded ? 'round' : 'butt'}
                    strokeWidth={strokeWidth + strokeOffset}
                    transform={TRANSFORM}
                    style={{transition: TRANSITION}}
                    {...settings?.gauge?.gaugePercent}
                />
                <text
                    className={"gauge_minAndMax"}
                    x="10%"
                    y="100%"
                    fill="white"
                    fontSize="10"
                    textAnchor="start"
                    {...settings?.text?.minAndMax}
                >
                    {format ? format(min) : min}
                </text>
                <text
                    className={"gauge_minAndMax"}
                    x="90%"
                    y="100%"
                    fill="white"
                    fontSize="10"
                    textAnchor="end"
                    {...settings?.text?.minAndMax}
                >
                    {format ? format(max) : max}
                </text>
                <text
                    className={"gauge_value"}
                    x="50%"
                    y="47%"
                    fill="white"
                    fontSize="20"
                    fontWeight="bold"
                    textAnchor="middle"
                    dy=".3em"
                    {...settings?.text?.value}
                >
                    {format ? format(value) : value}
                </text>
                <text
                    className={"gauge_unit"}
                    x="50%"
                    y="62.5%"
                    fill="white"
                    fontSize="10"
                    textAnchor="middle"
                    dy=".3em"
                    {...settings?.text?.unit}
                >
                    {unit}
                </text>
            </svg>
            {title && <span>{title}</span>}
        </div>
    );
}
