import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styles } from './ShowCountCard.styles';

const ShowCountCard = ({ title, count, path }) => {
    return (
        <Card sx={styles.card}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="h4">{count}</Typography>
            </CardContent>
        </Card>
    )
}

export default ShowCountCard;