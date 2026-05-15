export interface AuthUser {
  id: number;
  name: string;
  relativeName?: string;
  epicId?: string;
  email?: string;
  phone?: string | null;
  role: 'admin' | 'voter' | 'aspirant';
  age?: number;
  address?: string;
  aspirantId?: number;
  aspirantWardNumber?: string;
  wardId?: number;
  wardNumber?: string;
  wardName?: string;
  ward?: {
    id?: number;
    number?: string;
    name?: string;
    state?: string;
    parliamentary?: string;
    assembly?: string;
    zone?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  constituency?: string;
  state?: string;
  parliamentary?: string;
  assembly?: string;
  corporationName?: string;
  corporationNameL1?: string;
  psName?: string;
  psNameL1?: string;
  psLong?: string;
  psLat?: string;
  voterEpic?: string;
  gender?: string;
  profilePicture?: string | null;
  isChat?: boolean;
  isMeeting?: boolean;
  isDirectMeet?: boolean;
  isPhoneCall?: boolean;
  hasVoted?: boolean;
  electionId?: number;
  electionType?: string;
  electionName?: string;
  constituencyId?: number;
  constituencyName?: string;
  lokSabhaConstituency?: {
    id: number;
    name?: string;
    state?: string;
  } | null;
  stateAssemblyConstituency?: {
    id: number;
    name?: string;
    state?: string;
    parliamentary?: string;
  } | null;
  municipalCorporationConstituency?: {
    id: number;
    number?: string;
    name?: string;
    municipality?: string;
    zone?: string;
    assembly?: string;
    parliamentary?: string;
    state?: string;
    category?: string | null;
  } | null;
  // Gram Panchayat uses a different shape from the other constituencies —
  // identified by `srNo` (village serial number) plus the parent hierarchy.
  gramPanchayatConstituency?: {
    srNo: number;
    villageName?: string; 
    gpName?: string;
    taluk?: string;
    district?: string;
    state?: string;
  } | null;
}
