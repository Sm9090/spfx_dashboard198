import * as React from "react";
import { rgbToRgba } from "../../../utils";
import { Icon, Text } from "office-ui-fabric-react";
import styles from "./Tile.module.scss";

interface TileProps {
    title: string;
    value: number | string;
    color?: string;
    iconName?: string;
    width?: string

}




export const Tile: React.FC<TileProps> = ({ title, value, color, iconName ,width}) => {
    const bgColor = React.useMemo(() => {
        return rgbToRgba(color, 0.2);
    }, [color]);

    const randomPercentage = (Math.random() * 200 - 100).toFixed(2);
    const percentage = parseFloat(randomPercentage);
    const marketIcon = percentage >= 0 ? "Market" : "Marketdown";

    const size = (title === "Products Installed" || title === "Products Expiring Soon") ? 40 : 10;

    return (
        <div className={styles.tileContainer} style={{width}}>
            <div className={styles.iconContainer} style={{
                marginBottom: size === 40 && 20,
            }}>
                <Icon
                    iconName={iconName}
                    style={{ fontSize: size, color, marginBottom: 10, borderRadius: "100%", backgroundColor: bgColor, padding: 10 }}
                />
                <div style={{ display: "flex", gap: 2 }}>
                    <Icon
                        iconName={marketIcon}
                        style={{ fontSize: 15, color: color }}
                    />
                    <Text variant={size === 10 ? "small" : "medium"} nowrap block style={{ color, marginLeft: 10 }}>
                        {percentage}%
                    </Text>
                </div>
            </div>
            <Text variant="medium" nowrap block>
                {title}
            </Text>
            <div>
                <Text variant="medium" className="value" style={{ fontWeight: "bolder" }}>
                    {value}
                </Text>
            </div>
        </div>
    );
};