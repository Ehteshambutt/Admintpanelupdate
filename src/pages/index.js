// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
 
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Modal, Box, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';


 


 
const Dashboard = ({ initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [editCategory, setEditCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [EditCategoryId, setEditCategoryId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [Date, setDate] = useState('');

  // State to trigger re-fetch of categories
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleEditClick = (category) => {
    setEditCategory(category);
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
    setOpenModal(true);
  };

  const handleEditClickAdd = () => {
    setCategoryToDelete('');
    setEditCategory('')

      // Define the payload you want to send
      const payload = {
        name:editCategoryName,
        created_date: Date // Assuming 'abcd' is the data you want to send
      };
  
      // Perform the deletion API call
      axios.post(`http://localhost:5000/api/v1/categories/categories/`, payload)
       .then(response => {
      
        setOpenModal(false);
   
          // Handle the success case here
          console.log('Success:', response.data);
          
        })
       .catch(error => {
 
        console.error('Error:', error);
 
        });

  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    console.log(category,'category__')
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        // Perform the deletion API call
        await axios.delete(`http://localhost:5000/api/v1/categories/categories/${categoryToDelete}`);

        setDeleteDialogOpen(false);

        setRefreshCategories(prevState =>!prevState);
        
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };
  

  const handleCloseModal = () => {
    setEditCategory(null);
    setOpenModal(false);
  };

  const handleSaveChanges = async () => {
    if (editCategory) {
      try {
        const formData = new FormData();
        formData.append('name', editCategoryName);
        formData.append('image', imageFile); // Append the selected image file
        formData.append('id', EditCategoryId); // Append the selected image file

        const response = await axios.put(`http://localhost:5000/api/v1/categories/categories/${EditCategoryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        handleCloseModal();
        console.log('Category updated successfully:', response.data);

        // Trigger re-fetch of categories
        setRefreshCategories((prevState) => !prevState);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/categories/categories');
        const filteredCategories = response.data.filter((category) =>!category.deleted_date &&!category.updated_date);
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [refreshCategories]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Get the selected image file
  };

  return (<>    <Button   variant="outlined" color="error" style={{background: 'linear-gradient(109.5deg, rgb(13, 11, 136) 9.4%, rgb(86, 255, 248) 78.4%)',color:'white',float:"right"}} onClick={() => setOpenModal(true)}>
    <AddIcon/>  Add
         </Button>
    <ApexChartWrapper>
           
      <div  style={{marginTop:"3rem",}}>

      {categories?.map((category) => {
  // Construct the full URL for the image using a base path
  return (
    <Card key={category.id} sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
      {/* Category Image */}
      <img
        src={category.image_path}
        alt={category.name}
        style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
      />
      <CardContent sx={{ flex: '1 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" component="div">
            {category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created Date: {category.created_date}
          </Typography>
        </div>
        <div>
          <Button variant="outlined" style={{ marginRight: "3px", color: 'red' }} onClick={() => handleEditClick(category)}>
            <EditIcon /> Edit
          </Button>
          <Button variant="outlined" color="error" style={{ background: 'linear-gradient(160deg, #0093E9 0%, #74da94 50%, #16751f 100%)', color: 'white' }} onClick={() => handleDeleteClick(category.id)}>
            <DeleteForeverIcon /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
})}
<Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Are you sure you want to delete this category?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
      Confirm
    </Button>
  </DialogActions>
</Dialog>
        {/* Edit Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              boxShadow: 24,
              p: 4,
              minWidth: 400,
            }}
          >
            <Typography variant="h6" fontWeight='bold' gutterBottom>
             {editCategory?(<div>Edit Category</div>):<div>Add Category</div>} 
            </Typography>
            {editCategory && editCategory? (
              <form>
                <TextField
                  fullWidth
                  label="Category Name"
                  type="text"
                  defaultValue={editCategory.name}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField style={{marginTop:'1rem'}}
                  fullWidth
                  label="Created Date"
                  type="date"
                  defaultValue={editCategory.created_date? editCategory.created_date.split('T')[0] : ''}
                  InputLabelProps={{ shrink: true }}
                />
                   <TextField
        fullWidth
        label="Upload Image"
        type="file"
        onChange={handleImageChange}
        InputLabelProps={{ shrink: true }}
      />
                <Button onClick={handleSaveChanges} variant="contained" sx={{ mt: 2 }}>
                  Save Changes
                </Button>
              </form>
            ):(
              <form>
                <TextField
                  fullWidth
                  label="Category Name"
                  type="text"
                  defaultValue={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField style={{marginTop:'1rem'}}
                  fullWidth
                  label="Created Date"
                  type="date"
                  defaultValue={Date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                 />
                <Button onClick={()=>{editCategory?handleSaveChanges:handleEditClickAdd}} variant="contained" sx={{ mt: 2 }}>
                  Save Changes
                </Button>
              </form>
            )}
          </Box>
        </Modal>
      </div>
    </ApexChartWrapper></>

  );
};


export default Dashboard;

