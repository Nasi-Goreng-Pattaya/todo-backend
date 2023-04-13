import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a username"],
        validate: {
            validator: (v: string) => (
                /^[a-zA-Z0-9]+$/.test(v)
            ),
            message: (props: { value: string }) => (
                `${props.value} contains symbols, only alphanumeric characters are allowed!`
            )
        }
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        validate: {
            validator: (v: string) => (
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
            ),
            message: (props: { value: string }) => (
                `${props.value} is not a valid email address!`
            )
        }
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
    },
    gender: {
        type: String,
        enum: ['M', 'F']
    },
    birthDate: {
        type: Date,
        validate: {
            validator: (v: Date) => {
                return v < new Date();
            },
            message: "Birth date cannot be in the future"
        }
    },
    avatar: {
        type: Buffer,
        validate: {
            validator: (v: Buffer) => {
              if (!v) {
                // If no image is provided, validation fails
                return false;
              }
        
              // Check if the buffer contains valid image data
              const header = v.toString('hex', 0, 4)
              return (
                header === '89504e47' || // PNG
                header === '47494638' || // GIF
                header === 'ffd8ffe0' || // JPEG
                header === 'ffd8ffe1' || // JPEG
                header === 'ffd8ffe2'    // JPEG
              );
            },
            message: 'Invalid image file'
          }
    }
}, {
    timestamps: true,
})

export default mongoose.model('User', userSchema)
