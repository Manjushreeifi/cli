import { map as mapCapped } from 'lodash/fp';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { AirportPickup } from './AirportPickup';
import { TemporaryHousing } from './TemporaryHousing';
import { theme, Caption } from './material-theme';
import { EventCardContent } from './EventCardContent';

const map = mapCapped.convert({ cap: false });

const StyledCard = styled(Card)`
  height: 100%;
  box-shadow: 5px 5px 5px 5px #ccc;
  border-radius: 1em;
`;

const Genders = {
  Female: '👩',
  Male: '👨',
};

const requestSubComponents = {
  'Airport Pickup': [AirportPickup],
  'Airport Pickup & Temp Housing Request': [AirportPickup, TemporaryHousing],
};

const StudentName = ({ request }) => {
  const {
    Contact,
    signUpInfo: { isSignedUp, isPendingApproval },
  } = request;

  if (!isSignedUp) return null;

  if (isPendingApproval) {
    return (
      <Typography sx={{ color: theme.palette.warning.main }}>
        Pending Approval
      </Typography>
    );
  }

  return Contact ? (
    <Link
      to={`/studentDetail/${Contact.Id}`}
      style={{ textDecoration: 'none' }}
    >
      <Typography>{Contact.Name}</Typography>
    </Link>
  ) : null;
};

const RequestCardHeader = ({ request }) => {
  const { Intials__C, Age_Range__c, Gender__c, Degree_Level__c } = request.Contact || {};
  const Travel_companions_without_PII__c = request.Travel_companions_without_PII__c;

  const getContactCaptions = () => {
    const captions = [];
    if (Intials__C) {
        captions.push(Intials__C);
      }
    if (Gender__c) {
      captions.push(Gender__c);
    }
    if (Age_Range__c) {
      captions.push(`Age ${Age_Range__c}`);
    }
    if (Degree_Level__c) {
      captions.push(Degree_Level__c);
    }
    if (Travel_companions_without_PII__c) {
        captions.push(Travel_companions_without_PII__c);
    }
    return captions.join(', ');
  };

  return (
    <CardHeader
      avatar={
        <Avatar aria-label={Genders[Gender__c]}>{Genders[Gender__c]}</Avatar>
      }
      title={<StudentName request={request} />}
      subheader={
        <Stack spacing={1}>
          <Caption>{getContactCaptions()}</Caption>
          {request.Contact?.Home_Country__c}
        </Stack>
      }
    />
  );
};

const RequestCardContent = ({ request, ...props }) => {
  return (
    <Stack spacing={2}>
      {map(
        (Component, index) => (
          <React.Fragment key={index}>
            {Component({ request, ...props })}
          </React.Fragment>
        ),
        requestSubComponents[request.RecordType.Name] || [],
      )}
    </Stack>
  );
};

const Request = ({ request, ...props }) => (
  <StyledCard variant="outlined" id={`_${request.Id}`}>
    <RequestCardHeader request={request} />
    <CardContent>
      {props.requestType === 'Event' ? (
        <EventCardContent event={request} {...props} />
      ) : (
        <RequestCardContent request={request} {...props} />
      )}
    </CardContent>
  </StyledCard>
);

const Requests = ({ requests, ...props }) => (
  <section id="content">
    {requests.length === 0 ? (
      <div>No requests match criteria</div>
    ) : (
      <Grid container spacing={2}>
        {map(
          (request, index) => (
            <Grid
              container
              item
              key={index}
              sm={12}
              lg={6}
              style={{ width: '100%' }}
            >
              <Request request={request} {...props} />
            </Grid>
          ),
          requests,
        )}
      </Grid>
    )}
  </section>
);

export { Requests };
