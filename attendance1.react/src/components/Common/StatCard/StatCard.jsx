import { Box, Card, Typography, IconButton, Skeleton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { styles } from './StatCard.styles';

const StatCard = ({ 
  title, 
  count, 
  icon: IconComponent,
  path,
  loading = false,
  color = 'primary'
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <Card sx={styles.card}>
      <Box sx={styles.contentWrapper}>
        <Box sx={styles.iconWrapper(color)}>
          <IconComponent sx={styles.icon} />
        </Box>
        <Box sx={styles.textContent}>
          <Typography variant="h6" sx={styles.title}>
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={60} height={40} />
          ) : (
            <Typography variant="h4" sx={styles.count}>
              {count}
            </Typography>
          )}
        </Box>
        <Box className="actionWrapper" sx={styles.actionWrapper}>
          <Typography variant="caption" sx={styles.actionText(color)}>
            Enter
          </Typography>
          <IconButton 
            onClick={handleNavigate}
            sx={styles.actionButton(color)}
            aria-label={`Go to ${title}`}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default StatCard; 