export enum GroupTokens {
    SPORTS = "SPORTS",
    MUSIC = "MUSIC",
    MOVIES = "MOVIES",
    GAMING = "GAMING",
    TRAVEL = "TRAVEL",
    FOOD = "FOOD",
    TECHNOLOGY = "TECHNOLOGY",
    FITNESS = "FITNESS",
    BOOKS = "BOOKS",
    FASHION = "FASHION",
    PHOTOGRAPHY = "PHOTOGRAPHY",
    COOKING = "COOKING",
    POLITICS = "POLITICS",
    SCIENCE = "SCIENCE",
    ART = "ART",
    PETS = "PETS",
    BUSINESS = "BUSINESS",
    EDUCATION = "EDUCATION",
    HEALTH = "HEALTH",
    NATURE = "NATURE",
    HISTORY = "HISTORY",
    DIY = "DIY",
    ENTERTAINMENT = "ENTERTAINMENT",
    GARDENING = "GARDENING",
    PARENTING = "PARENTING",
    RELATIONSHIPS = "RELATIONSHIPS",
    RELIGION = "RELIGION",
    TVSHOWS = "TVSHOWS",
    CARS = "CARS",
    HIKING = "HIKING",
    OUTDOORS = "OUTDOORS",
    SHOPPING = "SHOPPING",
    FINANCE = "FINANCE",
    DESIGN = "DESIGN",
    COMEDY = "COMEDY",
    ANIME = "ANIME",
    YOGA = "YOGA",
    DANCE = "DANCE",
    CRAFTS = "CRAFTS",
    CYCLING = "CYCLING",
    PROGRAMMING = "PROGRAMMING",
    WRITING = "WRITING",
    TRAVELING = "TRAVELING",
    NEWS = "NEWS",
    BEAUTY = "BEAUTY",
    ENVIRONMENT = "ENVIRONMENT",
    ASTRONOMY = "ASTRONOMY",
    PARANORMAL = "PARANORMAL",
    PHILOSOPHY = "PHILOSOPHY",
    PSYCHOLOGY = "PSYCHOLOGY",
    SPIRITUALITY = "SPIRITUALITY",
    SELFIMPROVEMENT = "SELFIMPROVEMENT",
    MENTALHEALTH = "MENTALHEALTH",
    LOVE = "LOVE",
    FRIENDSHIP = "FRIENDSHIP",
    GRIEF = "GRIEF",
    HOPE = "HOPE",
    ANGER = "ANGER",
    ANXIETY = "ANXIETY",
    DEPRESSION = "DEPRESSION",
    HAPPINESS = "HAPPINESS",
    STRESS = "STRESS",
    LONELINESS = "LONELINESS",
    FEAR = "FEAR",
    FORGIVENESS = "FORGIVENESS",
    ACCEPTANCE = "ACCEPTANCE",
    EMPATHY = "EMPATHY",
    GRATITUDE = "GRATITUDE",
    COMPASSION = "COMPASSION",
    RESILIENCE = "RESILIENCE",
    TRUST = "TRUST",
    COMMUNICATION = "COMMUNICATION",
    KINDNESS = "KINDNESS",
    MOTIVATION = "MOTIVATION",
    INSPIRATION = "INSPIRATION",
    ENCOURAGEMENT = "ENCOURAGEMENT",
    MEDITATION = "MEDITATION",
    MINDFULNESS = "MINDFULNESS",
    REFLECTION = "REFLECTION",
    DREAMING = "DREAMING",
    ADVENTURE = "ADVENTURE",
    DISCOVERY = "DISCOVERY",
    NOSTALGIA = "NOSTALGIA",
    CREATIVITY = "CREATIVITY",
    CURIOSITY = "CURIOSITY",
    SIMPLICITY = "SIMPLICITY",
    FREEDOM = "FREEDOM",
    JUSTICE = "JUSTICE",
    EQUALITY = "EQUALITY",
    ETHICS = "ETHICS",
    LEADERSHIP = "LEADERSHIP",
    INNOVATION = "INNOVATION",
    CHANGE = "CHANGE",
    COMMUNITY = "COMMUNITY",
    DIVERSITY = "DIVERSITY",
    INCLUSION = "INCLUSION",
    SUSTAINABILITY = "SUSTAINABILITY",
    PRIVATE = "PRIVATE",
}

export enum MESSAGE_CONTENT_TYPE {
    TEXT,
    IMAGE,
}

export enum reqType {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = "DELETE",
}

export enum serviceRoute {
    login = "/auth/login",
    register = "/auth/register",
    session = "/auth/session",
    groupById = "/CJ130",
    group = "/CJ130",
    user = "/user",
    _groupMessages = "/CJ130/messages",
    groupUsers = "/CJ130/users",
    groupInvite = "/CJ130/invite",
    request = "/CJ130/request",
    groupRole = "/CJ130/role",
    removeUserFromGroup = "/CJ130/remove",
    userRequest = "/CJ130/requests",
    search = "/CJ130/search",
    socialLogin = "/auth/social-login",
    consent = "/user/consent",
    updateInvite = "/CJ130/invite",
    groupReminders = "/CJ130/reminders",
    reminder = "/CJ130/reminder",
    removeReminder = "/CJ130/restrictReminder",
    generateCode = "/auth/code",
    verifyCode = "/auth/code",
    deviceInfo = "/auth/deviceinfo",
    article = "/CJ130/article",
    allArtcles = "/CJ130/articles",
}

export enum service {
    authentication = "http://localhost:8999/v1",
    group = "http://localhost:8901/v1",
    messaging = "http://localhost:8900/",
    bot = 'http://localhost:9650',
    event = 'http://localhost:9651'
}

export enum IDBStore {
    blog = 'BLOG',
    chat = 'AICHAT'
}

export enum EwindowSizes {
    Xl = "Xl",
    M = "M",
    S = "S",
}

export type windowSize = "Xl" | "M" | "S";

export type sidePanelType = "Group" | "Util";

export enum EsidePanel {
    group = "Group",
    utit = "Util",
}

export enum ClientRole {
    OWNER = "OWNER",
    ADMIN = "AIDER",
    MEMBER = "MEMBER",
}

export enum EArticleStatus {
    draft = "DRAFT",
    pending = "PENDING",
    reviewed = "REVIEWED",
    published = "PUBLISHED"
}
export interface Article {
    content: string,
    created_at: Date,
    status: string,
    id?: number
}