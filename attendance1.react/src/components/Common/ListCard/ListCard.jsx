import { 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    Box, 
    Skeleton,
    useTheme 
} from '@mui/material';
import { styles } from './ListCard.styles';

const ListCard = ({
    title, 
    isLoading, 
    items = [], 
    renderItem, 
    emptyMessage,
    loadingCount = 2 
  }) => {
    const theme = useTheme();
    const themedStyles = styles(theme);
  
    return (
      <Card sx={themedStyles.card}>
        <CardContent>
          <Typography variant="h6" sx={themedStyles.cardTitle}>
            {title}
          </Typography>
          {isLoading ? (
            <List>
              {[...Array(loadingCount)].map((_, index) => (
                <ListItem key={index}>
                  <Skeleton variant="rectangular" width="100%" height={60} />
                </ListItem>
              ))}
            </List>
          ) : items.length > 0 ? (
            <List>
              {items.map((item, index) => (
                <Box key={item.id || index}>
                  {index > 0 && <Box sx={themedStyles.divider} />}
                  {renderItem(item)}
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={themedStyles.emptyMessage}>
              {emptyMessage}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };
  
export default ListCard;