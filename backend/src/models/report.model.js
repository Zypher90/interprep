import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    }
}, {
    _id: false,
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    }
}, {
    _id: false,
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"],
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true,
    }
}, {
    _id: false,
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true,
    },
    focus: {
        type: String,
        required: true,
    },
    tasks: [{
        type: String,
    }]
}, {
    _id: false,
})

const reportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    title: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const Report = mongoose.model("Report", reportSchema)

export default Report