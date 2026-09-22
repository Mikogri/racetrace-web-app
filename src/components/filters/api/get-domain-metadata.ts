import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";
import { applyDomainMetadata, domainMetadataSchema } from "../../../utils/domain-metadata";
import { filterQueryPolicy } from "./get-seasons";

export function useLoadDomainMetadata() {
  return useQuery({
    queryKey: ["domain-metadata"],
    queryFn: async ({ signal }) => {
      const metadata = await apiClient.get("/api/v1/metadata", domainMetadataSchema, { signal });
      applyDomainMetadata(metadata);
      return metadata;
    },
    ...filterQueryPolicy,
  });
}
