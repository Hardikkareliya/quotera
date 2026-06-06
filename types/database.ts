const NO_RELATIONS = [] as {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}[];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: typeof NO_RELATIONS;
      };
      organizations: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          gstin: string | null;
          pan: string | null;
          address: string | null;
          state_code: string;
          email: string | null;
          phone: string | null;
          website: string | null;
          bank_name: string | null;
          bank_account: string | null;
          bank_ifsc: string | null;
          logo_url: string | null;
          signature_url: string | null;
          payment_qr_url: string | null;
          watermark_url: string | null;
          default_currency: string;
          invoice_prefix: string;
          quote_prefix: string;
          next_invoice_number: number;
          next_quote_number: number;
          document_visibility?: Json | null;
          document_theme?: string;
          document_accent_custom?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name?: string;
          gstin?: string | null;
          pan?: string | null;
          address?: string | null;
          state_code?: string;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          bank_name?: string | null;
          bank_account?: string | null;
          bank_ifsc?: string | null;
          logo_url?: string | null;
          signature_url?: string | null;
          payment_qr_url?: string | null;
          watermark_url?: string | null;
          default_currency?: string;
          invoice_prefix?: string;
          quote_prefix?: string;
          next_invoice_number?: number;
          next_quote_number?: number;
          document_visibility?: Json;
          document_theme?: string;
          document_accent_custom?: string | null;
        };
        Update: {
          name?: string;
          gstin?: string | null;
          pan?: string | null;
          address?: string | null;
          state_code?: string;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          bank_name?: string | null;
          bank_account?: string | null;
          bank_ifsc?: string | null;
          logo_url?: string | null;
          signature_url?: string | null;
          payment_qr_url?: string | null;
          watermark_url?: string | null;
          invoice_prefix?: string;
          quote_prefix?: string;
          document_visibility?: Json;
          document_theme?: string;
          document_accent_custom?: string | null;
        };
        Relationships: typeof NO_RELATIONS;
      };
      org_members: {
        Row: {
          org_id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          org_id: string;
          user_id: string;
          role?: string;
        };
        Update: {
          role?: string;
        };
        Relationships: typeof NO_RELATIONS;
      };
      clients: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          billing_address: string | null;
          gstin: string | null;
          state_code: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          billing_address?: string | null;
          gstin?: string | null;
          state_code?: string;
          notes?: string | null;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          billing_address?: string | null;
          gstin?: string | null;
          state_code?: string;
          notes?: string | null;
        };
        Relationships: typeof NO_RELATIONS;
      };
      quotations: {
        Row: {
          id: string;
          org_id: string;
          client_id: string;
          number: string;
          status: QuotationStatus;
          issue_date: string;
          valid_until: string | null;
          subtotal: string;
          tax_total: string;
          total: string;
          tax_mode: string;
          currency: string;
          notes: string | null;
          terms: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          client_id: string;
          number: string;
          status?: QuotationStatus;
          issue_date?: string;
          valid_until?: string | null;
          subtotal?: string | number;
          tax_total?: string | number;
          total?: string | number;
          tax_mode?: string;
          currency?: string;
          notes?: string | null;
          terms?: string | null;
        };
        Update: {
          client_id?: string;
          status?: QuotationStatus;
          issue_date?: string;
          valid_until?: string | null;
          subtotal?: string | number;
          tax_total?: string | number;
          total?: string | number;
          tax_mode?: string;
          notes?: string | null;
          terms?: string | null;
        };
        Relationships: typeof NO_RELATIONS;
      };
      quotation_items: {
        Row: {
          id: string;
          quotation_id: string;
          description: string;
          sub_description: string | null;
          pricing_mode: string;
          hsn_sac: string | null;
          qty: string;
          unit_price: string;
          tax_rate: string;
          line_total: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          quotation_id: string;
          description: string;
          sub_description?: string | null;
          pricing_mode?: string;
          hsn_sac?: string | null;
          qty?: string | number;
          unit_price?: string | number;
          tax_rate?: string | number;
          line_total?: string | number;
          sort_order?: number;
        };
        Update: {
          description?: string;
          sub_description?: string | null;
          pricing_mode?: string;
          hsn_sac?: string | null;
          qty?: string | number;
          unit_price?: string | number;
          tax_rate?: string | number;
          line_total?: string | number;
          sort_order?: number;
        };
        Relationships: typeof NO_RELATIONS;
      };
      invoices: {
        Row: {
          id: string;
          org_id: string;
          client_id: string;
          quotation_id: string | null;
          number: string;
          status: InvoiceStatus;
          issue_date: string;
          due_date: string | null;
          subtotal: string;
          tax_total: string;
          total: string;
          tax_mode: string;
          amount_paid: string;
          currency: string;
          place_of_supply: string;
          notes: string | null;
          terms: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          client_id: string;
          quotation_id?: string | null;
          number: string;
          status?: InvoiceStatus;
          issue_date?: string;
          due_date?: string | null;
          subtotal?: string | number;
          tax_total?: string | number;
          total?: string | number;
          tax_mode?: string;
          amount_paid?: string | number;
          currency?: string;
          place_of_supply: string;
          notes?: string | null;
          terms?: string | null;
        };
        Update: {
          client_id?: string;
          status?: InvoiceStatus;
          issue_date?: string;
          due_date?: string | null;
          subtotal?: string | number;
          tax_total?: string | number;
          total?: string | number;
          tax_mode?: string;
          amount_paid?: string | number;
          notes?: string | null;
          terms?: string | null;
        };
        Relationships: typeof NO_RELATIONS;
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          sub_description: string | null;
          pricing_mode: string;
          hsn_sac: string | null;
          qty: string;
          unit_price: string;
          tax_rate: string;
          line_total: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          sub_description?: string | null;
          pricing_mode?: string;
          hsn_sac?: string | null;
          qty?: string | number;
          unit_price?: string | number;
          tax_rate?: string | number;
          line_total?: string | number;
          sort_order?: number;
        };
        Update: {
          description?: string;
          sub_description?: string | null;
          pricing_mode?: string;
          hsn_sac?: string | null;
          qty?: string | number;
          unit_price?: string | number;
          tax_rate?: string | number;
          line_total?: string | number;
          sort_order?: number;
        };
        Relationships: typeof NO_RELATIONS;
      };
      payments: {
        Row: {
          id: string;
          org_id: string;
          invoice_id: string;
          amount: string;
          method: PaymentMethod;
          paid_at: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          invoice_id: string;
          amount: string | number;
          method?: PaymentMethod;
          paid_at?: string;
          note?: string | null;
        };
        Update: {
          amount?: string | number;
          method?: PaymentMethod;
          paid_at?: string;
          note?: string | null;
        };
        Relationships: typeof NO_RELATIONS;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_org_member: { Args: { _org_id: string }; Returns: boolean };
      next_invoice_number: { Args: { _org_id: string }; Returns: string };
      next_quote_number: { Args: { _org_id: string }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";

export type PaymentMethod =
  | "cash"
  | "upi"
  | "bank_transfer"
  | "cheque"
  | "card"
  | "other";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Quotation = Database["public"]["Tables"]["quotations"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
