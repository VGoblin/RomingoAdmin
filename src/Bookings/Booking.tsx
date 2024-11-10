import { FC } from 'react'
import { Typography, Grid, Modal, CircularProgress } from '@mui/material'
import { gql, useQuery,useMutation } from "@apollo/client";
import { useEffect, useState } from 'react';
import DataTable, { ExpanderComponentProps }  from 'react-data-table-component';
import swal from 'sweetalert';
import { Button } from '@mui/material';
import { Box } from '@mui/material';

const BOOKING_LISTING_QUERY = gql`
  query BookingList {
    bookingList {
      id
      propertyId
      paymentIntentId
      cardId
      sabreConfirmationId
      propertyConfirmationId
      faunaDocId
      firstName
      lastName
      email
      mobileNumber
      checkInAtLocal
      checkOutAtLocal
      deadlineLocal
      data
      captured
      hotel {
        name
      }
      cancellationFeePrice
      intentType
      setupIntentObject
      customerId
      reservationStatus
    }
  }
`;

// const CAPTURE_PAYMENT = gql`
//   mutation CapturePaymentInput($id: String!){
//     capturePaymentInput(input: $id){
//       id
//     }
//   }
// `;

interface BookingInterface {
  id:string,
  propertyId:string,
  paymentIntentId:string,
  cardId:string,
  sabreConfirmationId:string,
  propertyConfirmationId:string,
  faunaDocId:string,
  firstName:string,
  lastName:string,
  email:string,
  mobileNumber:string,
  checkInAtLocal:string,
  checkOutAtLocal: string,
  deadlineLocal: string,
  data: any,
  hotel: any,
  cancellationFeePrice: any,
  captured:number
  intentType: string
  setupIntentObject: any
  customerId:string
  reservationStatus: string
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export const Booking: FC = () => {

  const [open, setOpen] = useState(false);
  const [loadingCap, setLoading] = useState(false);
  const [captureRow, setCaptureRow] = useState<any>({});
  const handleOpen = (row:any) => {
    setCaptureRow(row)
    setOpen(true);
  }
  const handleClose = () => {
    setCaptureRow({})
    setOpen(false);
  }

const formatUnix = (timestamp:number) => {
  return new Date(timestamp).toLocaleDateString('en-US')
}
const formatUnixLong = (timestamp:number) => {
  return new Date(timestamp).toLocaleString()
}

const getDiffDays = (startDateUnix: number, endDateUnix: number) => {
  const date1 = new Date(startDateUnix).getTime();
  const date2 = new Date(endDateUnix).getTime();
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
}

const mapUtmSource = (utmSource: string, utmMedium: string) => {
  switch (utmSource) {
    case 'google':
      return 'Google Ads'
    case 'direct':
      return 'Direct'
    case 'facebook':
      return 'Facebook Ads'
    default:
      return 'Unknown'
  }
}

const columns:any = [
  {
    name: 'Booking Date',
    selector: (row:BookingInterface) => formatUnixLong(parseInt(row.setupIntentObject?.created + '000')),
    width: '170px',
  },
  {
    name: 'Hotel Name',
    selector: (row:BookingInterface) => row.hotel.name.name,
    width: '280px'
  },
  {
    name: 'Source',
    selector: (row:BookingInterface) => mapUtmSource(row.data.utmSource, row.data.utmMedium),
    width: '140px'
  },
  {
    name: 'Confirmation Id',
    selector: (row:BookingInterface) => row.propertyConfirmationId,
    width: '130px'
  },
  {
      name: 'firstName',
      selector: (row:BookingInterface) => row.firstName,
  },
  {
      name: 'lastName',
      selector: (row:BookingInterface) => row.lastName,
  },
  {
      name: 'email',
      selector: (row:BookingInterface) => row.email,
      width: '200px',
  },
  // {
  //     name: 'email',
  //     selector: (row:BookingInterface) => row.email,
  // },
  // {
  //     name: 'Phone Number',
  //     selector: (row:BookingInterface) => row.mobileNumber,
  // },
    // {
    //     name: 'propertyConfirmpropertyIdationId',
    //     selector: (row:BookingInterface) => row.propertyId,
    // },
    // {
    //     name: 'paymentIntentId',
    //     selector: (row:BookingInterface) => row.paymentIntentId,
    // },
    // {
    //     name: 'cardId',
    //     selector: (row:BookingInterface) => row.cardId,
    // },
    // {
    //     name: 'sabreConfirmationId',
    //     selector: (row:BookingInterface) => row.sabreConfirmationId,
    // },
    {
      name: '$$ (-tax)',
      selector: (row:BookingInterface) => `$${row.data.totalPrice}`,
    },
    {
      name: 'Check-in',
      selector: (row:BookingInterface) => formatUnix(parseInt(row.checkInAtLocal)),
    },
    {
      name: 'Check-out',
      selector: (row:BookingInterface) => formatUnix(parseInt(row.checkOutAtLocal)),
    },
    {
      name: 'nightly rate',
      selector: (row:BookingInterface) => `$${row.data.averagePrice}`,
    },
    {
      name: 'Nights',
      selector: (row:BookingInterface) => getDiffDays(parseInt(row.checkInAtLocal), parseInt(row.checkOutAtLocal)),
    },
    {
      name: 'Commission',
      selector: (row:BookingInterface) => `$${(Math.abs(parseInt(row.data.totalPrice) * .1)).toFixed(2)}`,
    },
    {
      name: "Booking window",
      selector: (row:BookingInterface) => `${getDiffDays(parseInt(row.setupIntentObject?.created + '000'), parseInt(row.checkInAtLocal))} days`,
      width: '120px',
    },
    {
      name: 'Can cancel?',
      selector: (row:BookingInterface) => row.data.cancelationPolicy.cancelable ? 'Yes' : 'No',
    },
    {
      name: 'Cancel by time',
      selector: (row:BookingInterface) => formatUnixLong(parseInt(row.deadlineLocal)),
      width: '180px',
    },
    // {
    //   name: 'cancellationFeePrice',
    //   selector: (row:BookingInterface) => row.cancellationFeePrice,
    // },
    {
        name: 'Charge Card',
        selector: (row:BookingInterface) => <>
          {
            row.reservationStatus == 'cancelled' ?
            <p>Booking Cancelled</p> :
            row.captured ?
            <p>Already captured</p> :
            <Button variant="contained" onClick={ () => handleOpen(row) }>Capture</Button> 
          }
        </>,
    },
    // {
    //     name: 'faunaDocId',
    //     selector: (row:BookingInterface) => row.faunaDocId,
    // },
  
];


  const CAPTURE_PAYMENT = gql`mutation CapturePayment($input: CapturePaymentInput!) {
    capturePayment(input: $input) {
      statusCode
      status
    }
  }`;

  const [capturePayment] = useMutation(CAPTURE_PAYMENT)


  const capturePaymentAction = (id:string, setupIntent:any, data:any, customerId:string) => {

      if (setupIntent == "") {
        return  swal({
          title: "Oops!",
          text: "No Capture Id.",
          icon: "error"
        });
      }

      setLoading(true)

      capturePayment({ variables: {
        input :{
          id: id,
          amount: data.totalPriceAfterTax,
          customerId: customerId,
          paymentMethodId: setupIntent.payment_method
        }
      }
      })
      .then((res) => {
        console.log("response",res)
        // window.location.reload()
        if (res?.data?.capturePayment?.statusCode == 400) {
              swal({
              title: "Oops!",
              text: res?.data?.capturePayment?.status,
              icon: "error"
            });
        }

        if (res?.data?.capturePayment?.statusCode == 200) {
            swal({
            title: "Good Job!",
            text: res?.data?.capturePayment?.status,
            icon: "success"
          });
      }

      setLoading(false)
      handleClose()

      })
      .catch((e) => {
        console.log(e.message)
        setLoading(false)
      })

  }
  const ExpandedComponent: React.FC<ExpanderComponentProps<BookingInterface>> = ({ data }) => {
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };


  const [showTab, setShowTab] = useState<String>('default')
  const [list, setList] = useState<BookingInterface[]>([]);
  const [cancelledList, setCancelledList] = useState<BookingInterface[]>([]);


  const { loading, error, data } = useQuery(BOOKING_LISTING_QUERY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
     if (data) {
      const defaultList = data.bookingList.filter((row: BookingInterface) => row.reservationStatus !== 'cancelled')
      const cancelList = data.bookingList.filter((row: BookingInterface) => row.reservationStatus === 'cancelled')

      setList(defaultList)
      setCancelledList(cancelList)
     }
  },[data])

  return (
    <Grid container>
        <Grid item xs={12}>
          <Typography variant='h3'> Bookings </Typography>
          <Button variant={showTab === 'default' ? "contained": 'outlined'} onClick={() => setShowTab('default')}>Default</Button>
          <Button variant={showTab === 'cancelled' ? "contained": 'outlined'}  onClick={() => setShowTab('cancelled')}>Cancelled</Button>
        </Grid>
        <div>
        {loading ? (
          <Box
            sx={{
              position: "relative",
              right: 0,
              left: 0,
              zIndex: 9999
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={showTab === 'default' ? list : cancelledList}
            paginationPerPage={10}
            pagination
            expandableRows
            expandableRowsComponent={ExpandedComponent}
          />
        )}
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <small> Are you sure to want capture payment from {captureRow?.firstName} ?</small>
            </Typography>
            {
              loadingCap 
              ? <>
                 <Typography color={"success"} id="modal-modal-title" variant="h6" component="h2">
                   <small> Loading...</small>
               </Typography>
              </>
              : 
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={ () => capturePaymentAction(captureRow?.id, captureRow?.setupIntentObject, captureRow?.data, captureRow?.customerId) }>Yes</Button>
                    {" "}
                    <Button variant="contained"   color="error" onClick={ () => handleClose() }>NO</Button>
              </Typography>
            }
          </Box>
        </Modal>
    </Grid>
  )
}