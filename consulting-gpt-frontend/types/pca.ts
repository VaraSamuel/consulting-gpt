export interface PcaComponentInfo {
  component_number: number;
  explained_variance_ratio: number;
  description: string;
}

export interface TransformedPcaDataItem {
  [techName: string]: [number, number];
}

export interface PcaData {
  technology_id: number;
  components: PcaComponentInfo[];
  transformed_data: TransformedPcaDataItem;
  total_variance_explained: number;
  id: number;
}

export interface PcaPoint {
  [techName: string]: [number, number]; // [PC1_value, PC2_value]
}

export interface PcaLoading {
  axis: string;
  pc1_loading: number;
  pc2_loading: number;
}

export interface PcaView {
  type: 'pca';
  points: PcaPoint;
  loadings: PcaLoading[];
  variance_explained: [number, number]; // [variance_PC1, variance_PC2]
}

export interface ClusterMember {
  name: string;
  distance: number;
  coords: [number, number]; // [PC1_value, PC2_value]
}

export interface Cluster {
  id: number;
  name: string;
  center: [number, number]; // [PC1_value, PC2_value]
  spread: number;
  contains_target: boolean;
  members: ClusterMember[];
}

export interface ClusterView {
  clusters: Cluster[];
}

export interface InteractiveSettings {
  show_labels: boolean;
  show_annotations: boolean;
  selected_axes: any[]; // Define more strictly if structure is known
  click_details: Record<string, any>; // Define more strictly if structure is known
}

export interface PcaVisualizationData {
  type: 'pca';
  interactive: InteractiveSettings;
  pca_view: PcaView;
  cluster_view: ClusterView;
}
