const supabase = require("../lib/supabase");

class RegistrationService {
  // Generate unique registration ID
  async generateRegistrationId() {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const randomNum = Math.floor(Math.random() * 9999) + 1;
      const paddedNumber = randomNum.toString().padStart(4, "0");
      const registrationId = `ITMS2025-${paddedNumber}`;

      // Check if this ID already exists
      const { data } = await supabase
        .from("registrations")
        .select("registration_id")
        .eq("registration_id", registrationId)
        .limit(1);

      if (!data || data.length === 0) {
        return registrationId;
      }

      attempts++;
    }

    throw new Error("Unable to generate unique registration ID");
  }

  // Check for existing registrations with same email, student ID, or transaction ID
  async checkForDuplicates(formData) {
    try {
      // Check for duplicate email
      if (formData.email) {
        const { data: emailCheck } = await supabase
          .from("registrations")
          .select("registration_id, full_name")
          .ilike("email", formData.email)
          .limit(1);

        if (emailCheck && emailCheck.length > 0) {
          return {
            isDuplicate: true,
            message: `This email address is already registered (Registration ID: ${emailCheck[0].registration_id}). Please contact event management at itmclub@diu.edu.bd to modify your registration information.`,
          };
        }
      }

      // Check for duplicate student ID (only if provided)
      if (formData.student_id) {
        const { data: studentIdCheck } = await supabase
          .from("registrations")
          .select("registration_id, full_name")
          .ilike("student_id", formData.student_id)
          .limit(1);

        if (studentIdCheck && studentIdCheck.length > 0) {
          return {
            isDuplicate: true,
            message: `This Student ID is already registered (Registration ID: ${studentIdCheck[0].registration_id}). Please contact event management at itmclub@diu.edu.bd to modify your registration information.`,
          };
        }
      }

      // Check for duplicate transaction ID (only if provided)
      if (formData.transaction_id) {
        const { data: transactionIdCheck } = await supabase
          .from("registrations")
          .select("registration_id, full_name")
          .ilike("transaction_id", formData.transaction_id)
          .limit(1);

        if (transactionIdCheck && transactionIdCheck.length > 0) {
          return {
            isDuplicate: true,
            message: `This Transaction ID has already been used (Registration ID: ${transactionIdCheck[0].registration_id}). Please contact event management at itmclub@diu.edu.bd if you believe this is an error.`,
          };
        }
      }

      return { isDuplicate: false };
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      // If we can't check for duplicates, allow the registration to proceed
      // The database constraints will catch any duplicates
      return { isDuplicate: false };
    }
  }

  async getRegistrationByStatus(registrationId) {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("registration_id", registrationId.trim())
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Registration not found
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching registration by status:", error);
      throw error;
    }
  }

  async createRegistration(formData) {
    try {
      // Test Supabase connection first
      const { error: connectionError } = await supabase
        .from("registrations")
        .select("count", { count: "exact", head: true });

      if (connectionError) {
        throw new Error(
          "Database connection failed. Please check your Supabase configuration."
        );
      }

      // Check for duplicates before attempting to save
      const duplicateCheck = await this.checkForDuplicates(formData);
      if (duplicateCheck.isDuplicate) {
        throw new Error(duplicateCheck.message);
      }

      const registrationId = await this.generateRegistrationId();

      const registrationData = {
        registration_id: registrationId,
        full_name: formData.full_name,
        institution_name: formData.institution_name || null,
        current_study_year: formData.current_study_year || null,
        department: formData.department || null,
        batch: formData.batch || null,
        student_id: formData.student_id || null,
        contact_number: formData.contact_number,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        tshirt_size: formData.tshirt_size || null,
        competitions: formData.competitions,
        team_name: formData.team_name || null,
        payment_method: formData.payment_method || null,
        representative: formData.representative || null,
        bkash_number: formData.bkash_number || null,
        transaction_id: formData.transaction_id || null,
        registration_fee: formData.registration_fee,
        status: "pending",
        admin_notes: null,
        verified_at: null,
        verified_by: null,
        action_history: [],
      };

      const { data, error } = await supabase
        .from("registrations")
        .insert([registrationData])
        .select()
        .single();

      if (error) {
        // Handle specific duplicate errors from database constraints
        if (
          error.message.includes("email") &&
          error.message.includes("already registered")
        ) {
          throw new Error(error.message);
        }
        if (
          error.message.includes("Student ID") &&
          error.message.includes("already registered")
        ) {
          throw new Error(error.message);
        }
        if (
          error.message.includes("Transaction ID") &&
          error.message.includes("already been used")
        ) {
          throw new Error(error.message);
        }

        // Handle unique constraint violations
        if (error.code === "23505") {
          if (error.message.includes("email")) {
            throw new Error(
              "This email address is already registered. Please contact event management at itmclub@diu.edu.bd to modify your registration information."
            );
          }
          if (error.message.includes("student_id")) {
            throw new Error(
              "This Student ID is already registered. Please contact event management at itmclub@diu.edu.bd to modify your registration information."
            );
          }
          if (error.message.includes("transaction_id")) {
            throw new Error(
              "This Transaction ID has already been used. Please contact event management at itmclub@diu.edu.bd if you believe this is an error."
            );
          }
          throw new Error(
            "This information has already been registered. Please contact event management at itmclub@diu.edu.bd for assistance."
          );
        }

        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error creating registration:", error);
      throw error;
    }
  }
}

module.exports = new RegistrationService();
