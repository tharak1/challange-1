import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, Card, CardContent, Container, TextField, Typography } from "@mui/material";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as yup from 'yup';
import dayjs from "dayjs";
import Grid from '@mui/material/Grid2';
import { useState } from "react";


const schema = yup.object().shape({
  FirstName: yup.string().required("First Name is required"),
  LastName: yup.string().required("Last Name is required"),
  DateOfBirth: yup.string().required("Date Of Birth is Required"),
  Address:yup.string().required("Address is required"),
  CountryCode:yup.string().required("Country Code is required"),
  MobileNumber:yup.string().min(10).max(10).required("Mobile Number is required"),
  Hobbies: yup.array()
  .min(1, "You can't leave this blank.")
  .required("You can't leave this blank.")
  .nullable(),
  Skills:yup.array()
  .min(1, "You can't leave this blank.")
  .required("You can't leave this blank.")
  .nullable(),
});

type FromFields = yup.InferType<typeof schema>;



function App() {

  const {
    register,
    handleSubmit, 
    formState: { errors }, 
    reset,
    control
  } = useForm<FromFields>({
    resolver: yupResolver(schema),
    defaultValues: { Skills: [] }
  })

  const { fields, append, remove } = useFieldArray({
    control, 
    name: "Skills", 
  });

  const [submitedDetails,setSumitedDetails] = useState<FromFields[]>([]);


  const OnSubmit:SubmitHandler<FromFields> = (data) =>{
    console.log(data);
    setSumitedDetails([data, ...submitedDetails]);
    reset();
  }



  const options = ['Cricket', 'Chess', 'Tech', 'FootBall', 'Watching Tv', 'Stamp Collection'];


  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ }} >
          <form onSubmit={handleSubmit(OnSubmit)}>

            <TextField error={errors.FirstName?.message ? true : false} id="outlined-basic" label="First Name" variant="outlined" {...register("FirstName")} sx={{width:'100%',margin:'12px 0px'}} />
            <p style={{color:"red"}}>{errors.FirstName?.message}</p> 

            <TextField error={errors.LastName?.message ? true : false} id="outlined-basic" label="Last Name" variant="outlined" {...register("LastName")} sx={{width:'100%',margin:'12px 0px'}}  />
            <p style={{color:"red"}}>{errors.LastName?.message}</p>

            <LocalizationProvider  dateAdapter={AdapterDayjs}>
              <Controller
                  name="DateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Date Of Birth"
                      value={field.value ? dayjs(field.value,"DD/MM/YYYY") : null}
                      onChange={(date) => field.onChange(date ? dayjs(date).format("DD/MM/YYYY"):null)}
                      // renderInput={(params:any) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                      maxDate={dayjs(new Date())}
                    />
                  )}
                />
            </LocalizationProvider>

            <p style={{color:"red"}}>{errors.DateOfBirth?.message}</p>


            <TextField error={errors.Address?.message ? true : false} id="outlined-basic" label="Address" variant="outlined" {...register("Address")} sx={{width:'100%',margin:'12px 0px'}} />
            <p style={{color:"red"}}>{errors.Address?.message}</p>

            <Box sx={{display:"flex", justifyContent:"space-between"}}>
              <Box sx={{width:"30%", display:"flex", flexDirection:"column" }}>
                <TextField error={errors.CountryCode?.message ? true : false} id="outlined-basic" label="Country Code" variant="outlined" {...register("CountryCode")} sx={{ margin:'12px 0px' }} />
                <p style={{color:"red"}}>{errors.CountryCode?.message}</p>
              </Box>

              <Box sx={{width:"65%", display:"flex", flexDirection:"column" }}>
                <TextField error={errors.MobileNumber?.message ? true : false} id="outlined-basic" label="Mobile Number" variant="outlined" {...register("MobileNumber")}  sx={{ margin:'12px 0px'}} />
                <p style={{color:"red"}}>{errors.MobileNumber?.message}</p>
              </Box>
            </Box>
            


              <Box sx={{width:"100%", margin:'12px 0px' }}>
                <Controller
                name="Hobbies"
                control={control}
                render={({field})=>(
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={options}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    value={field.value||[]}
                    onChange={(_, newValue)=>field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Hobbies"
                        placeholder="Favorites"
                      />
                    )}
                  />
                )}

                />
                <p style={{color:"red"}}>{errors.Hobbies?.message}</p>

              </Box>

          {fields.map((field, index) => (
            <Box sx={{ display: 'flex' }} key={field.id}>
              <Controller
                render={({ field }) => <TextField {...field} />}
                name={`Skills.${index}`}
                control={control}
              />
              <Button
                variant="outlined"
                onClick={() => remove(index)}
                sx={{ marginLeft: '10px' }}
              >
                Delete
              </Button>
            </Box>
          ))}

          <Button
            variant="contained"
            type="button"
            onClick={() => append("")} 
            sx={{ margin: '12px 0px' }}
          >
            Add Skill
          </Button>

          <p style={{color:"red"}}>{errors.Skills?.message}</p>



          <Box sx={{width:"100%",margin:'12px 0px' }}>
            <Button  variant="outlined" loadingPosition="end" type="submit">
              Submit
            </Button>
          </Box>
              


          </form>
        </Box>
      </Container>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={{lg:4, xs: 1, sm: 2, md: 3 }}>

          {
            submitedDetails.length>0? submitedDetails.map((item:FromFields)=>(
                  <Grid size={1}>

                  <Card sx={{ minWidth: 275, boxShadow:"15" }}>
                    <CardContent>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {item.FirstName} {item.LastName}
                      </Typography>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {item.DateOfBirth}
                      </Typography>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {item.Address}
                      </Typography>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {item.CountryCode} {item.MobileNumber}
                      </Typography>
                          <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 16 }}>
                              Hobbies:
                          </Typography>
                        {
                          item.Hobbies!.map((hobbie)=>(
                          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                              {hobbie}
                          </Typography>
                          ))
                        }
                          <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 16 }}>
                              Skills:
                          </Typography>
                        {
                          item.Skills!.map((skill)=>(
                          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                              {skill}
                          </Typography>
                          ))
                        }

                      
                    </CardContent>
                  </Card>

                  </Grid>
            )):
            <p>No previous data</p>
          }
        </Grid>
    </Box>
    </>
  )
}

export default App
