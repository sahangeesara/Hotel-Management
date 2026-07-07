import { PackageType } from "./package-type";

export class Package {
  id?: number;
  package_code?: string;
  description?: string;
  name?: string;
  package_type_id?: PackageType;
  package_amount?: number;
  is_active?: boolean;
}
