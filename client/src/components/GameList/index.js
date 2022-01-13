import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHistory } from 'react-router-dom';

import { Grid } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import data from '../../utils/data';
import sorting from '../../utils/sorting';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const GameList = ({listings})  =>  {
  const [expanded, setExpanded] = React.useState(-1);
  const [results, editResults] = React.useState({
    category: '',
    sort: '',
    active: [...listings],
    last: [],
    original: [...listings],
  });

  const handleListChange = (event) => {
    const selectName = event.target.name;
    const value = event.target.value;
    let category
    let sort
    let list = [...listings];

    // If the box is the 'category' select
    if(selectName === 'category') {
      // Change the category into the value selected
      category = value;
    } else {
      // Else use the saved value
      category = results.category;
    }

    // If the category is not blank
    if(category) {
      // Filter the original list received
      list = list.filter(item => item.genre === category);
    }

    // If the box is the 'sort' select
    if(selectName === 'sort') {
      // Change the sort to the value selected
      sort = value;
    } else {
      // Else use the saved value
      sort = results.sort;
    }

    // Determine how to sort with a switch
    switch(sort) {
      case 'AA':
        list = list.sort(sorting.titleSort);
        break;
      case 'AD':
        list = list.sort(sorting.titleSort).reverse();
        break;
      case 'PA':
        list = list.sort(sorting.priceSort);
        break;
      case 'PD':
        list = list.sort(sorting.priceSort).reverse();
        break;
      default:
        // Don't sort if nothing selected
        break;
    }

    editResults({
      ...results,
      category: category,
      sort: sort,
      active: [...list],
      last: [...results.active]
    });
  };
  
  const handleExpandClick = (i) => {
    setExpanded(expanded === i ? -1 : i);
  };
  let history = useHistory();
 
  const [favorite, setFavorite] = useState([]);  

  const addToFavorite = _id => {
    if (!favorite.includes(_id)) setFavorite(favorite.concat(_id));
  };
  
  return(
    <>

    <Grid container spacing={2} sx={{ p: '2%' }}>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Genre</InputLabel>
          <Select
            value={results.category}
            name='category'
            label="Category"
            onChange={handleListChange}
            >
            <MenuItem value={''}>None</MenuItem>
            {data.genres.map((genre, i) => (
              <MenuItem value={genre} key={i}>{genre}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
    
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Sort</InputLabel>
          <Select
            value={results.sort}
            label="Sort"
            name='sort'
            onChange={handleListChange}
            >
            <MenuItem value={''}>None</MenuItem>
            <MenuItem value={'AA'}>Alphabetical: A-Z</MenuItem>
            <MenuItem value={'AD'}>Alphabetical: Z-A</MenuItem>
            <MenuItem value={'PA'}>Price: Low to High</MenuItem>
            <MenuItem value={'PD'}>Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Grid>

    </Grid>

    <div className="flex-row justify-space-around" style={{ backgroundColor: "white",  }}>
    {listings &&
      results.active.map((listing, i) => (
    <Card key={listing._id} sx={{ my: 5, border: 3, width: "30%", boxShadow: "0px 10px 20px" }}>
      <CardHeader 
        avatar={
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
            G
          </Avatar>
        }
        title={listing.title} 
        component='button'
        onClick={()=> history.push(`/listing/${listing._id}`)}
        sx={{my: 2, mx: "auto" }}
      > 
      </CardHeader> 
      <CardMedia
        component="img"
        height="194"
        image={listing.img}
        alt="Game"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" >
          {listing.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"
        onClick={()=>addToFavorite(listing._id)}
       >
          <FavoriteIcon 
           />
        </IconButton>
        <ExpandMore        
          onClick={() => handleExpandClick(i)}
          aria-expanded={expanded === i}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded === i} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Listing Details:</Typography>
          <Typography  >
           Price: {listing.price}
          </Typography>
          <Typography >
          Quantity: {listing.quantity}
          </Typography>
          <Typography >
          Genre: {listing.genre}
          </Typography>
          <Typography>
            Seller: {listing?.seller?.username}
          </Typography>
        </CardContent>
      </Collapse>
    </Card> 
    ))}
    </div>
    </>
  )};       

  export default GameList;